import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Cancel, Description, Gavel, Refresh, Save } from "@mui/icons-material";
import { Alert, Button, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useConfirm } from "../../shared/components/ConfirmDialog/ConfirmProvider";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import DashboardContentTab from "../../shared/components/Dashboard/DashboardContentTab";
import DashboardContentTabs from "../../shared/components/Dashboard/DashboardContentTabs";
import CustomFab from "../../shared/components/Fab/CustomFab";
import Carregando from "../../shared/components/Feedback/Carregando";
import CNPJInput from "../../shared/components/Input/CNPJInput";
import browserHistory from "../../shared/utils/browserHistory";
import { formatCnpj, testCnpjFormat, unformatCnpj } from "../../shared/utils/cnpjUtils";
import { dateToApiDateTimeSchema, dateValidationSchema, toApiDateTime } from "../../shared/utils/dateUtils";
import { handleServerErrors } from "../../shared/utils/formUtils";
import { useGruposAdminQuery } from "../grupo/GrupoQueries";
import { IEmpresaAdmin } from "./Empresa";
import { usePatchEmpresaAdminMutation, usePostEmpresaAdminMutation } from "./EmpresaMutations";
import { ContratoRequestSchema, PatchEmpresaAdminRequestSchema, PostEmpresaAdminRequestSchema } from "./EmpresaPayloads";
import { useEmpresaAdminQuery } from "./EmpresaQueries";

const ContratoFormSchema = z.object({
	ativo: z.boolean(),
	limiteUsuarios: z.coerce.number(),
	inicio: z.nullable(dateValidationSchema),
	fim: z.nullable(dateValidationSchema),
	valor: z.nullable(z.coerce.number()),
})

type ContratoFormData = z.infer<typeof ContratoFormSchema>;

const EmpresaFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	cnpj: z.string().refine(cnpj => testCnpjFormat(cnpj), 'CNPJ inválido'),
	grupoId: z.coerce.number().min(1, 'obrigatório'),
	contratoId: z.coerce.number().min(1, 'obrigatório'),
	contratos: z.array(ContratoFormSchema).min(1, 'obrigatório um contrato'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type EmpresaFormData = z.infer<typeof EmpresaFormSchema>;

const EmpresaForm = () => {

	const { empresaId: empresaIdParam } = useParams();
	const empresaId = parseInt(empresaIdParam!);
	const isEditMode = useRef(empresaIdParam !== 'add').current;

	const [empresa, setEmpresa] = useState<IEmpresaAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { confirm } = useConfirm();

	const { data, refetch, isFetching, error } = useEmpresaAdminQuery(isEditMode ? empresaId : undefined);

	const { mutateAsync: postEmpresaAdmin } = usePostEmpresaAdminMutation();
	const { mutateAsync: patchEmpresaAdmin } = usePatchEmpresaAdminMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, dirtyFields, disabled, isSubmitting},
		setError,
		setValue,
		reset,
		control
	} = useForm<EmpresaFormData>({
		defaultValues: {
			nome: '',
			cnpj: '',
			grupoId: -1,
			contratoId: -1,
			contratos: [],
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(EmpresaFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const onSubmit = async (data: EmpresaFormData) => {
		if (true || await confirm({
			title: "Salvar alterações?",
			cancelText: 'Continuar editando',
			confirmColor: 'success',
			confirmText: 'Salvar',
			confirmIcon: <Save />,
		})) {
			try {

				if (isEditMode) {

					const response = await patchEmpresaAdmin({
						empresaId: empresaId!,
						payload: PatchEmpresaAdminRequestSchema.parse({
							...data,
							cnpj: unformatCnpj(data.cnpj),
						}),
					});

					reset();
					setEmpresa(response);

				} else {

					const response = await postEmpresaAdmin({
						payload: PostEmpresaAdminRequestSchema.parse({
							...data,
							cnpj: unformatCnpj(data.cnpj),
						}),
					});

					browserHistory.push(`/admin/empresas/${response.empresaId}`);

				}

				enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });

			} catch (error: any) {
				enqueueSnackbar('Falha ao salvar!', { variant: 'error' });
				const errors = error?.response?.data?.errors;
				handleServerErrors(errors, setError);
				console.error(error);
				console.log(data);
			}
		}
	}

	const onError = (error: any) => {
		enqueueSnackbar('Falha ao salvar', { variant: 'error' });
		console.error(error);
		console.log(control._formValues);
	}

	const handleDiscardChanges = useCallback(async () => {
		if (await confirm({
			title: "Descartar alterações?",
			message: 'Atenção: dados não salvos serão perdidos!',
			cancelText: 'Continuar editando',
			confirmColor: 'error',
			confirmText: 'Descartar',
			confirmIcon: <Cancel />,
		})) {
			reset();
		}
	}, []);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;

			setEmpresa(result.data!);

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
		if (!!updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);

		switch (tab) {
			case 0:
				return ["nome", "cnpj", "grupoId"].some(r => keys.includes(r));
				break;
			case 1:
				return ["contratoId"].some(r => keys.includes(r)) ||
					keys.some(k => k.startsWith("contratos"));
				break;
		}
		return false;
	}, [errors]);

	const contratoId = useWatch({ control, name: 'contratoId' });
	const setContratoId = useCallback((id: number) => setValue('contratoId', id, { shouldDirty: true }), [setValue]);

	const { fields: contratos, append: appendContrato, remove: removeContrato } = useFieldArray({ control, name: "contratos" });
	const appendNovoContrato = useCallback(() => appendContrato({
		ativo: false,
		limiteUsuarios: 1,
		inicio: null,
		fim: null,
		valor: 0,
	}), [appendContrato]);

	const { data: grupos } = useGruposAdminQuery();

	return <DashboardContent
		titulo={isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push('/admin/empresas')} ><ArrowBack /></CustomFab>,
			...(isEditMode ? [<CustomFab tooltip={{ title: 'Atualizar' }} badge={{ invisible: !isNewDataAvailable }} key={1} onClick={() => update()} disabled={isUpdating} loading={isUpdating}><Refresh /></CustomFab>] : []),
			<CustomFab tooltip={{ title: 'Salvar' }} key={2} onClick={handleSubmit(onSubmit, onError)} color='success' disabled={!isDirty || isSubmitting} loading={isSubmitting}><Save /></CustomFab>,
			...(isDirty ? [<CustomFab tooltip={{ title: 'Descartar Alterações' }} key={3} onClick={handleDiscardChanges} color='error' disabled={isSubmitting}><Cancel /></CustomFab>] : [])
		]}
	>
		{(!empresa && isFetching) ? <Carregando /> :
			(!empresa && error) ? <Alert severity='error'> Falha ao obter empresa </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
						<DashboardContentTab error={hasTabError(1)} icon={<Gavel />} label="Contratos" key={1} />
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					<Grid container spacing={1}>
						<Grid size={12}>
							{JSON.stringify(contratos)}
						</Grid>
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
						{errors?.contratoId && <Grid size={12}>
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
											inputRef={field.ref}
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
								{contratoId == i + 1 ? <Alert severity='success'>Atual</Alert> : <Button color='success' onClick={() => setContratoId(i + 1)}>
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

export default EmpresaForm;