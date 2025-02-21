import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Description } from "@mui/icons-material";
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
import useHandleDelete from "../../shared/components/Form/useHandleDelete";
import useHandleDiscardChanges from "../../shared/components/Form/useHandleDiscardChanges";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";
import { IAdicionalAdmin } from "./Adicional";
import { useAdicionalDeleteMutation, useAdicionalPatchMutation, useAdicionalPostMutation } from "./AdicionalMutations";
import { AdicionalPatchRequestSchema, AdicionalPostRequestSchema } from "./AdicionalPayloads";
import { useAdicionalAdminByEmpresaIdAndAdicionalIdQuery } from "./AdicionalQueries";

const AdicionalFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	tipoProduto: z.string().min(1, 'obrigatório'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type AdicionalFormData = z.infer<typeof AdicionalFormSchema>;

const AdicionalFormPage = () => {

	const { adicionalId: adicionalIdParam } = useParams();
	const adicionalId = parseInt(adicionalIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = adicionalIdParam !== 'add';

	const [adicional, setAdicional] = useState<IAdicionalAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useAdicionalAdminByEmpresaIdAndAdicionalIdQuery(empresaId, isEditMode ? adicionalId : undefined);

	const { mutateAsync: postAdicional } = useAdicionalPostMutation();
	const { mutateAsync: patchAdicional } = useAdicionalPatchMutation();
	const { mutateAsync: deleteAdicional } = useAdicionalDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<AdicionalFormData>({
		defaultValues: {
			nome: '',
			tipoProduto: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(AdicionalFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: AdicionalFormData) => {
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

	const patch = async (data: AdicionalFormData) => {
		const response = await patchAdicional({
			empresaId: empresaId!,
			adicionalId: adicionalId!,
			payload: AdicionalPatchRequestSchema.parse({
				...data,
			}),
		});
		reset();
		setAdicional(response);
	}

	const post = async (data: AdicionalFormData) => {
		const response = await postAdicional({
			empresaId: empresaId!,
			payload: AdicionalPostRequestSchema.parse({
				...data,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastros/adicionais/${response.adicionalId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteAdicional({
				empresaId: empresaId!,
				adicionalId: adicionalId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastros/adicionais`);
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
			setAdicional(result.data!);
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
		if (adicional)
			reset(AdicionalFormSchema.parse({
				...adicional,
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [adicional]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['nome', 'tipoProduto'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Adicional' : 'Novo Adicional'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/adicionais`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!adicional && isFetching) ? <Carregando /> :
			(!adicional && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
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
								name={`tipoProduto`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Tipo Adicional</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Tipo Adicional"
											>
												<MenuItem value=''><em>Selecione</em></MenuItem>
												{Object.keys(VendaTipoProdutoSchema.enum).map((tipoProduto) => <MenuItem key={tipoProduto} value={tipoProduto}>{tipoProduto}</MenuItem>)}
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

export default AdicionalFormPage;