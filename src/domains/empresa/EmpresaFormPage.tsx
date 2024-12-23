import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Description, Gavel } from "@mui/icons-material";
import { Alert, Button, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import CNPJInput from "../../shared/components/Input/CNPJInput";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import browserHistory from "../../shared/utils/browserHistory";
import { formatCnpj, testCnpjFormat, unformatCnpj } from "../../shared/utils/cnpjUtils";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { useGruposQuery } from "../grupo/GrupoQueries";
import { IEmpresaAdmin } from "./Empresa";
import { useEmpresaAdminPatchMutation, useEmpresaAdminPostMutation } from "./EmpresaMutations";
import { EmpresaAdminPatchRequestSchema, EmpresaAdminPostRequestSchema } from "./EmpresaPayloads";
import { useEmpresaAdminQuery } from "./EmpresaQueries";

const ContratoFormSchema = z.object({
	ativo: z.boolean(),
	limiteUsuarios: z.coerce.number(),
	inicio: z.nullable(dateValidationSchema),
	fim: z.nullable(dateValidationSchema),
	valor: z.nullable(z.coerce.number()),
})

const EmpresaFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	cnpj: z.string().refine(cnpj => testCnpjFormat(cnpj), 'CNPJ inválido'),
	grupoId: z.coerce.number().min(1, 'obrigatório'),
	contratoAtualId: z.coerce.number().min(1, 'obrigatório'),
	contratos: z.array(ContratoFormSchema).min(1, 'obrigatório um contrato'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type EmpresaFormData = z.infer<typeof EmpresaFormSchema>;

const EmpresaFormPage = () => {

	const { empresaId: empresaIdParam } = useParams();
	const empresaId = parseInt(empresaIdParam!);

	const isEditMode = empresaIdParam !== 'add';

	const [empresa, setEmpresa] = useState<IEmpresaAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useEmpresaAdminQuery(isEditMode ? empresaId : undefined);

	const { mutateAsync: postEmpresaAdmin } = useEmpresaAdminPostMutation();
	const { mutateAsync: patchEmpresaAdmin } = useEmpresaAdminPatchMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<EmpresaFormData>({
		defaultValues: {
			nome: '',
			cnpj: '',
			grupoId: -1,
			contratoAtualId: -1,
			contratos: [],
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(EmpresaFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: EmpresaFormData) => {
		try {
			if (isEditMode)
				await patch(data)
			else
				await post(data);
			enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
		} catch (error: any) {
			const errors = error?.response?.data?.errors;
			handleServerErrors(errors);
		}
	}

	const onError = (error: any) => {
		enqueueSnackbar('Falha ao salvar', { variant: 'error' });
		console.error(error);
	}

	const patch = async (data: EmpresaFormData) => {
		const response = await patchEmpresaAdmin({
			empresaId: empresaId!,
			payload: EmpresaAdminPatchRequestSchema.parse({
				...data,
				cnpj: unformatCnpj(data.cnpj),
			}),
		});
		reset();
		setEmpresa(response);
	}

	const post = async (data: EmpresaFormData) => {
		const response = await postEmpresaAdmin({
			payload: EmpresaAdminPostRequestSchema.parse({
				...data,
				cnpj: unformatCnpj(data.cnpj),
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/admin/empresas/${response.empresaId}`);
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setEmpresa(result.data!);
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
		if (empresa)
			reset(EmpresaFormSchema.parse({
				...empresa,
				cnpj: formatCnpj(empresa.cnpj),
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [empresa]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ["nome", "cnpj", "grupoId"].some(r => keys.includes(r));
				break;
			case 1:
				return ["contratoAtualId"].some(r => keys.includes(r)) ||
					keys.some(k => k.startsWith("contratos"));
				break;
		}
		return false;
	}, [errors]);

	const contratoAtualId = useWatch({ control, name: 'contratoAtualId' });
	const setContratoAtualId = useCallback((id: number) => setValue('contratoAtualId', id, { shouldDirty: true }), [setValue]);

	const { fields: contratos, append: appendContrato, remove: removeContrato } = useFieldArray({ control, name: "contratos" });
	const appendNovoContrato = useCallback(() => appendContrato({
		ativo: false,
		limiteUsuarios: 1,
		inicio: null,
		fim: null,
		valor: 0,
	}), [appendContrato]);

	const { data: grupos } = useGruposQuery();

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push('/admin/empresas')} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!empresa && isFetching) ? <Carregando /> :
			(!empresa && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
						<DashboardContentTab error={hasTabError(1)} icon={<Gavel />} label="Contratos" key={1} />
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					<Grid container spacing={1}>
						<Grid size={{ xs: 12, md: 6 }}>
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
						<Grid size={{ xs: 12, md: 6 }}>
							<Controller
								name={`cnpj`}
								control={control}
								render={({ field, fieldState }) => (
									<CNPJInput
										{...field}
										textField={<TextField
											required
											variant='filled'
											fullWidth
											label="CNPJ"
											error={!!(fieldState?.error)}
											helperText={fieldState?.error?.message}
										/>}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<FormControl fullWidth required error={!!(errors?.grupoId)}>
								<InputLabel>Grupo</InputLabel>
								<Controller
									name={`grupoId`}
									control={control}
									render={({ field }) => (
										<Select
											{...field}
											value={field.value > 0 ? field.value : ''}
											variant="filled"
											label="Grupo"
										>
											{(grupos ?? []).map((grupo) => <MenuItem key={grupo.grupoId} value={grupo.grupoId}>{grupo.nome}</MenuItem>)}
										</Select>
									)}
								/>
								<FormHelperText error>{errors?.grupoId?.message}</FormHelperText>
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
					</Grid>
					<Grid container spacing={1}>
						<Grid size={12}>
							<Button
								fullWidth
								onClick={appendNovoContrato}
								color='success'
								variant='contained'
								disabled={disabled}
							>
								Adicionar Contrato
							</Button>
						</Grid>
						{(errors?.contratos?.root || errors?.contratos?.message) && <Grid size={12}>
							<Alert severity='error'>{errors.contratos?.root?.message || errors.contratos?.message}</Alert>
						</Grid>}
						{errors?.contratoAtualId && <Grid size={12}>
							<Alert severity='error'>obrigatório definir um contrato atual</Alert>
						</Grid>}
						{contratos.map((contrato, i) => <React.Fragment key={contrato.id} >
							<Grid size={12}>
								<Divider><Chip label={i + 1} /></Divider>
							</Grid>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`contratos.${i}.limiteUsuarios`}
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											required
											fullWidth
											label="Limite de Usuários"
											error={!!(fieldState?.error)}
											helperText={fieldState?.error?.message}
											type="number"
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`contratos.${i}.valor`}
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											value={field.value ?? ''}
											fullWidth
											label="Valor"
											error={!!(fieldState?.error)}
											helperText={fieldState?.error?.message}
											type="number"
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 6, md: 6 }}>
								<Controller
									name={`contratos.${i}.inicio`}
									control={control}
									render={({ field, fieldState },) => (
										<DateTimePicker
											{...field}
											label='Início'
											slotProps={{
												field: { clearable: true },
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
									name={`contratos.${i}.fim`}
									control={control}
									render={({ field, fieldState }) => (
										<DateTimePicker
											{...field}
											label='Fim'
											slotProps={{
												field: { clearable: true },
												textField: {
													fullWidth: true,
													error: !!(fieldState?.error),
													helperText: fieldState?.error?.message,
												},
											}}
										/>
									)} />
							</Grid>
							<Grid size={{ xs: 6, md: 6 }} alignItems='center'>
								<Controller
									name={`contratos.${i}.ativo`}
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={<Switch {...field} checked={field.value} />}
											labelPlacement='start'
											label="Ativo"
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 6, md: 6 }} alignItems='center'>
								{contratoAtualId == i + 1 ? <Alert variant="filled" severity='success'>Atual</Alert> : <Button variant="outlined" color='success' onClick={() => setContratoAtualId(i + 1)}>
									Marcar como atual
								</Button>}
							</Grid>
							<Grid size={12}>
								<Button
									onClick={() => removeContrato(i)}
									color='error'
									variant='contained'
									fullWidth
									disabled={disabled}
								>
									Remover
								</Button>
							</Grid>
						</React.Fragment>
						)}
					</Grid>
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
}

export default EmpresaFormPage;