import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Delete, Description } from "@mui/icons-material";
import { Alert, FormControl, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
import { IDominio } from "./Dominio";
import { useDominioQuery } from "./DominioQueries";
import { useDominioDeleteMutation, useDominioPatchMutation, useDominioPostMutation } from "./DominioMutations";
import { DominioPatchRequestSchema, DominioPostRequestSchema } from "./DominioPayloads";
import EmpresaChip from "../empresa/EmpresaChip";
import { useEmpresasAdminQuery } from "../empresa/EmpresaQueries";
import useHandleDelete from "../../shared/components/Form/useHandleDelete";

const DominioFormSchema = z.object({
	dominio: z.string().min(1, 'obrigatório').max(200),
	empresaId: z.number().min(1, 'obrigatório'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type DominioFormData = z.infer<typeof DominioFormSchema>;

const DominioFormPage = () => {

	const { dominioId: dominioIdParam } = useParams();
	const dominioId = parseInt(dominioIdParam!);

	const isEditMode = dominioIdParam !== 'add';

	const [dominio, setDominio] = useState<IDominio>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useDominioQuery(isEditMode ? dominioId : undefined);

	const { mutateAsync: postDominio } = useDominioPostMutation();
	const { mutateAsync: patchDominio } = useDominioPatchMutation();
	const { mutateAsync: deleteDominio } = useDominioDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<DominioFormData>({
		defaultValues: {
			dominio: '',
			empresaId: -1,
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(DominioFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: DominioFormData) => {
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

	const patch = async (data: DominioFormData) => {
		const response = await patchDominio({
			dominioId: dominioId!,
			payload: DominioPatchRequestSchema.parse({
				...data
			}),
		});
		reset();
		setDominio(response);
	}

	const post = async (data: DominioFormData) => {
		const response = await postDominio({
			payload: DominioPostRequestSchema.parse({
				...data
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/admin/dominios/${response.dominioId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteDominio({
				dominioId: dominioId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/admin/dominios/`);
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
			setDominio(result.data!);
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
		if (dominio)
			reset(DominioFormSchema.parse({
				...dominio
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [dominio]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ["dominio", 'empresaId'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	const {data: empresas} = useEmpresasAdminQuery();

	return <DashboardContent
		titulo={isEditMode ? 'Editar Domínio' : 'Novo Domínio'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push('/admin/dominios')} ><ArrowBack /></CustomFab>,
			...formFabs,
		]}
	>
		{(!dominio && isFetching) ? <Carregando /> :
			(!dominio && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid size={{ xs: 12, md: 6 }}>
							<Controller
								name={`dominio`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Domínio"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
						<FormControl fullWidth required error={!!(errors?.empresaId)}>
								<InputLabel>Empresa</InputLabel>
								<Controller
									name={`empresaId`}
									control={control}
									render={({ field }) => (
										<Select
											{...field}
											value={field.value > 0 ? field.value : ''}
											variant="filled"
											label="Empresa"
										>
											{(empresas ?? []).map((empresa) => <MenuItem key={empresa.empresaId} value={empresa.empresaId}><EmpresaChip empresa={empresa}/></MenuItem>)}
										</Select>
									)}
								/>
								<FormHelperText error>{errors?.empresaId?.message}</FormHelperText>
							</FormControl>
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

export default DominioFormPage;