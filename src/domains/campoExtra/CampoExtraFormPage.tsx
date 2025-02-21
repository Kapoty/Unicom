import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Description } from "@mui/icons-material";
import { Alert, Autocomplete, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
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
import { CampoExtraSlotSchema, ICampoExtraAdmin } from "./CampoExtra";
import { useCampoExtraDeleteMutation, useCampoExtraPatchMutation, useCampoExtraPostMutation } from "./CampoExtraMutations";
import { CampoExtraPatchRequestSchema, CampoExtraPostRequestSchema } from "./CampoExtraPayloads";
import { useCampoExtraAdminByEmpresaIdAndCampoExtraSlotQuery } from "./CampoExtraQueries";

const CampoExtraFormSchema = z.object({
	campoExtraSlot: z.string().min(1, 'obrigatório'),
	nome: z.string().min(1, 'obrigatório').max(100),
	ativo: z.boolean(),
	obrigatorio: z.boolean(),
	elevado: z.boolean(),
	sugestoes: z.array(z.string()),
	referencia: z.boolean(),
	regex: z.string().max(250),
	valorPadrao: z.string().max(250),
	tipoProduto: z.string(),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type CampoExtraFormData = z.infer<typeof CampoExtraFormSchema>;

const CampoExtraFormPage = () => {

	const { campoExtraSlot } = useParams();

	const empresaId = useEmpresaIdParam();

	const isEditMode = campoExtraSlot !== 'add';

	const [campoExtra, setCampoExtra] = useState<ICampoExtraAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useCampoExtraAdminByEmpresaIdAndCampoExtraSlotQuery(empresaId, isEditMode ? campoExtraSlot : undefined);

	const { mutateAsync: postCampoExtra } = useCampoExtraPostMutation();
	const { mutateAsync: patchCampoExtra } = useCampoExtraPatchMutation();
	const { mutateAsync: deleteCampoExtra } = useCampoExtraDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control,
		watch
	} = useForm<CampoExtraFormData>({
		defaultValues: {
			campoExtraSlot: '',
			nome: '',
			ativo: false,
			obrigatorio: false,
			elevado: false,
			sugestoes: [],
			referencia: false,
			regex: '',
			valorPadrao: '',
			tipoProduto: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(CampoExtraFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: CampoExtraFormData) => {
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

	const patch = async (data: CampoExtraFormData) => {
		const response = await patchCampoExtra({
			empresaId: empresaId!,
			campoExtraSlot: campoExtraSlot!,
			payload: CampoExtraPatchRequestSchema.parse({
				...data,
				sugestoes: data.sugestoes,
				regex: data.regex !== '' ? data.regex : null,
				tipoProduto: data.tipoProduto !== '' ? data.tipoProduto : null,
			}),
		});
		reset();
		setCampoExtra(response);
	}

	const post = async (data: CampoExtraFormData) => {
		const response = await postCampoExtra({
			empresaId: empresaId!,
			payload: CampoExtraPostRequestSchema.parse({
				...data,
				regex: data.regex !== '' ? data.regex : null,
				tipoProduto: data.tipoProduto !== '' ? data.tipoProduto : null,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastros/campos-extras/${response.campoExtraId.campoExtraSlot}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteCampoExtra({
				empresaId: empresaId!,
				campoExtraSlot: campoExtraSlot!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastros/campos-extras`);
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
			setCampoExtra(result.data!);
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
		if (campoExtra)
			reset(CampoExtraFormSchema.parse({
				...campoExtra,
				regex: campoExtra?.regex ?? '',
				campoExtraSlot: campoExtra.campoExtraId.campoExtraSlot,
				tipoProduto: campoExtra?.tipoProduto ?? '',
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [campoExtra]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['campoExtraSlot', 'nome', 'ativo', 'obrigatorio', 'elevado', 'sugestoes', 'referencia', 'regex', 'valorPadrao', 'tipoProduto'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	const campoExtraSlotValue = watch('campoExtraSlot');

	return <DashboardContent
		titulo={isEditMode ? 'Editar Campo Extra' : 'Novo Campo Extra'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/campos-extras`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!campoExtra && isFetching) ? <Carregando /> :
			(!campoExtra && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					{[<Grid key={0} container spacing={1}>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`campoExtraSlot`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)} disabled={isEditMode}>
										<InputLabel>Slot</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Slot"
											>
												<MenuItem value=''><em>Selecione</em></MenuItem>
												{Object.keys(CampoExtraSlotSchema.enum).map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
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
									<FormControl fullWidth error={!!(fieldState?.error)}>
										<InputLabel>Tipo Produto</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Tipo Produto"
											>
												<MenuItem value=''><em>Ambos</em></MenuItem>
												{Object.keys(VendaTipoProdutoSchema.enum).map((tipoProduto) => <MenuItem key={tipoProduto} value={tipoProduto}>{tipoProduto}</MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 4, md: 4 }}>
							<Controller
								name={`obrigatorio`}
								control={control}
								render={({ field, fieldState }) => (<>
									<FormControlLabel
										control={<Switch {...field} checked={field.value} />}
										labelPlacement='start'
										label="Obrigatório"
									/>
									<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 4, md: 4 }}>
							<Controller
								name={`elevado`}
								control={control}
								render={({ field, fieldState }) => (<>
									<FormControlLabel
										control={<Switch {...field} checked={field.value} />}
										labelPlacement='start'
										label="Elevado"
									/>
									<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 4, md: 4 }}>
							<Controller
								name={`ativo`}
								control={control}
								render={({ field, fieldState }) => (<>
									<FormControlLabel
										control={<Switch {...field} checked={field.value} />}
										labelPlacement='start'
										label="Ativo"
									/>
									<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</>
								)}
							/>
						</Grid>
						{campoExtraSlotValue?.includes('CONTRATO') && <>
							<Grid size={{ xs: 12, md: 12 }}>
								<Controller
									name={`valorPadrao`}
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											fullWidth
											variant='filled'
											label="Valor Padrão"
											error={!!(fieldState?.error)}
											helperText={fieldState?.error?.message}
										/>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 8 }}>
								<Controller
									name={`sugestoes`}
									control={control}
									render={({ field, fieldState }) => 
										<Autocomplete
											multiple
											freeSolo
											options={[]}
											value={field.value}
											onChange={(event, value) => field.onChange(value)}
											renderInput={(params) => (
												<TextField
													{...params}
													variant="outlined"
													label="Sugestões"
													error={!!(fieldState?.error)}
													helperText={fieldState?.error?.message ?? "Pressione ENTER para adicionar"}
												/>
										)}
									/>}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Controller
									name={`referencia`}
									control={control}
									render={({ field, fieldState }) => (<>
										<FormControlLabel
											control={<Switch {...field} checked={field.value} />}
											labelPlacement='start'
											label="Referência"
										/>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
										</>
									)}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 12 }}>
								<Controller
									name={`regex`}
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											fullWidth
											variant='filled'
											label="Regex"
											error={!!(fieldState?.error)}
											helperText={fieldState?.error?.message}
										/>
									)}
								/>
							</Grid>
						</>}
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

export default CampoExtraFormPage;