import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Delete, Description } from "@mui/icons-material";
import { Alert, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, Icon, iconClasses, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import DashboardContentTab from "../../shared/components/Dashboard/DashboardContentTab";
import DashboardContentTabs from "../../shared/components/Dashboard/DashboardContentTabs";
import CustomFab from "../../shared/components/Fab/CustomFab";
import Carregando from "../../shared/components/Feedback/Carregando";
import useFormFabs from "../../shared/components/Form/useFormFabs";
import useHandleDiscardChanges from "../../shared/components/Form/useHandleDiscardChanges";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import { usePapeisQuery } from "../papel/PapelQueries";
import useHandleDelete from "../../shared/components/Form/useHandleDelete";
import { IEquipeAdmin } from "./Equipe";
import { useEquipeAdminByEmpresaIdAndEquipeIdQuery, useEquipeByEmpresaIdAndEquipeIdQuery } from "./EquipeQueries";
import { useEquipeDeleteMutation, useEquipePatchMutation, useEquipePostMutation } from "./EquipeMutations";
import { EquipePatchRequestSchema, EquipePostRequestSchema } from "./EquipePayloads";
import { usePerfisByEmpresaIdQuery } from "../perfil/PerfilQueries";
import PerfilChip from "../perfil/PerfilChip";

const EquipeFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	icone: z.string().max(50),
	supervisorId: z.number().min(1, 'obrigatório'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type EquipeFormData = z.infer<typeof EquipeFormSchema>;

const EquipeFormPage = () => {

	const { equipeId: equipeIdParam } = useParams();
	const equipeId = parseInt(equipeIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = equipeIdParam !== 'add';

	const [equipe, setEquipe] = useState<IEquipeAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useEquipeAdminByEmpresaIdAndEquipeIdQuery(empresaId, isEditMode ? equipeId : undefined);

	const { mutateAsync: postEquipe } = useEquipePostMutation();
	const { mutateAsync: patchEquipe } = useEquipePatchMutation();
	const { mutateAsync: deleteEquipe } = useEquipeDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<EquipeFormData>({
		defaultValues: {
			nome: '',
			icone: '',
			supervisorId: -1,
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(EquipeFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: EquipeFormData) => {
		try {
			if (isEditMode)
				await patch(data)
			else
				await post(data);
			enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
		} catch (error: any) {
			console.error(error);
			const errors = error?.response?.data?.errors;
			handleServerErrors(errors);
		}
	}

	const onError = (error: any) => {
		enqueueSnackbar('Falha ao salvar', { variant: 'error' });
		console.error(error);
	}

	const patch = async (data: EquipeFormData) => {
		const response = await patchEquipe({
			empresaId: empresaId!,
			equipeId: equipeId!,
			payload: EquipePatchRequestSchema.parse({
				...data,
				icone: data.icone !== '' ? data.icone : null,
				supervisorId: data.supervisorId,
			}),
		});
		reset();
		setEquipe(response);
	}

	const post = async (data: EquipeFormData) => {
		const response = await postEquipe({
			empresaId: empresaId!,
			payload: EquipePostRequestSchema.parse({
				...data,
				icone: data.icone !== '' ? data.icone : null,
				supervisorId: data.supervisorId,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastros/equipes/${response.equipeId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteEquipe({
				empresaId: empresaId!,
				equipeId: equipeId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastros/equipes`);
		} catch (error) {
			enqueueSnackbar('Falha ao excluir', { variant: 'error' });
			console.error(error);
		}
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);
	const handleDelete = useHandleDelete(_delete);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setEquipe(result.data!);
			setIsUpdateRequired(false);
		} catch (error) {
			enqueueSnackbar('Falha ao atualizar!', { variant: 'error' });
		} finally {
			setIsUpdating(false);
		}
	}, []);

	useEffect(() => {
		if (isEditMode)
			update();
	}, []);

	useEffect(() => {
		if (equipe)
			reset(EquipeFormSchema.parse({
				...equipe,
				icone: equipe?.icone ?? '',
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [equipe]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['nome', 'icone', 'supervisorId'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	const {data: perfis} = usePerfisByEmpresaIdQuery(empresaId);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Equipe' : 'Nova Equipe'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/equipes`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!equipe && isFetching) ? <Carregando /> :
			(!equipe && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`nome`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Nome"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`icone`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										fullWidth
										variant='filled'
										label="Ícone"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										slotProps={{
											input: {
												endAdornment: <InputAdornment position="end"><Icon>{field.value !== '' ? field.value : 'groups'}</Icon></InputAdornment>,
											}
										}}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`supervisorId`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Supervisor</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Supervisor"
											>
												<MenuItem value={-1}><em>Selecione</em></MenuItem>
												{(perfis ?? []).map((perfil) => <MenuItem key={perfil.perfilId} value={perfil.perfilId}><PerfilChip perfil={perfil}/></MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
						{isEditMode && <>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`createdAt`}
									control={control}
									render={({ field, fieldState }) => (
										<DateTimePicker
											{...field}
											label='Criado em'
											disabled
											slotProps={{
												textField: {
													fullWidth: true,
													error: !!(fieldState?.error),
													helperText: fieldState?.error?.message,
												},
											}}
										/>
									)} />
							</Grid>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`updatedAt`}
									control={control}
									render={({ field, fieldState }) => (
										<DateTimePicker
											{...field}
											label='Atualizado em'
											disabled
											slotProps={{
												textField: {
													fullWidth: true,
													error: !!(fieldState?.error),
													helperText: fieldState?.error?.message,
												},
											}}
										/>
									)} />
							</Grid>
						</>}
					</Grid>]}
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
}

export default EquipeFormPage;