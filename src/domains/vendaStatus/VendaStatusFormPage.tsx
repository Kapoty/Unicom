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
import { VendaTipoProdutoSchema } from "../venda/Venda";
import { IVendaStatusAdmin, VendaStatusCategoriaSchema, VendaStatusTipoSchema } from "./VendaStatus";
import { useVendaStatusAdminByEmpresaIdAndVendaStatusIdQuery } from "./VendaStatusQueries";
import { useVendaStatusDeleteMutation, useVendaStatusPatchMutation, useVendaStatusPostMutation } from "./VendaStatusMutations";
import { VendaStatusPatchRequestSchema, VendaStatusPostRequestSchema } from "./VendaStatusPayloads";
import { useUsuarioLogadoQuery } from "../usuario/UsuarioQueries";

const VendaStatusFormSchema = z.object({
	nome: z.string().min(1, 'obrigatório').max(100),
	global: z.boolean(),
	icone: z.string(),
	categoria: z.string().min(1, 'obrigatório'),
	cor: z.string(),
	ordem: z.coerce.number(),
	tipoProduto: z.string(),
	tipo: z.string().min(1, 'obrigatório'),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type VendaStatusFormData = z.infer<typeof VendaStatusFormSchema>;

const VendaStatusFormPage = () => {

	const { vendaStatusId: vendaStatusIdParam } = useParams();
	const vendaStatusId = parseInt(vendaStatusIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = vendaStatusIdParam !== 'add';

	const [vendaStatus, setVendaStatus] = useState<IVendaStatusAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useVendaStatusAdminByEmpresaIdAndVendaStatusIdQuery(empresaId, isEditMode ? vendaStatusId : undefined);

	const { mutateAsync: postVendaStatus } = useVendaStatusPostMutation();
	const { mutateAsync: patchVendaStatus } = useVendaStatusPatchMutation();
	const { mutateAsync: deleteVendaStatus } = useVendaStatusDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control,
		watch
	} = useForm<VendaStatusFormData>({
		defaultValues: {
			global: false,
			nome: '',
			icone: '',
			categoria: '',
			cor: '',
			ordem: 1,
			tipoProduto: '',
			tipo: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(VendaStatusFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: VendaStatusFormData) => {
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

	const patch = async (data: VendaStatusFormData) => {
		const response = await patchVendaStatus({
			empresaId: empresaId!,
			vendaStatusId: vendaStatusId!,
			payload: VendaStatusPatchRequestSchema.parse({
				...data,
				tipoProduto: data.tipoProduto !== '' ? data.tipoProduto : null,
				cor: '#' + data.cor,
			}),
		});
		reset();
		setVendaStatus(response);
	}

	const post = async (data: VendaStatusFormData) => {
		const response = await postVendaStatus({
			empresaId: empresaId!,
			payload: VendaStatusPostRequestSchema.parse({
				...data,
				empresaId: data.global ? null : empresaId,
				tipoProduto: data.tipoProduto !== '' ? data.tipoProduto : null,
				cor: '#' + data.cor,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastros/venda-status/${response.vendaStatusId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteVendaStatus({
				empresaId: empresaId!,
				vendaStatusId: vendaStatusId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastros/venda-status`);
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
			setVendaStatus(result.data!);
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
		if (vendaStatus)
			reset(VendaStatusFormSchema.parse({
				...vendaStatus,
				global: vendaStatus.empresaId == null,
				tipoProduto: vendaStatus.tipoProduto ? vendaStatus.tipoProduto : '',
				cor: vendaStatus.cor.replace('#', ''),
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [vendaStatus]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['global', 'nome', 'icone', 'categoria', 'cor', 'ordem', 'tipoProduto', 'tipo'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	const {data: usuarioLogado} = useUsuarioLogadoQuery();

	const global = watch('global');

	useEffect(() => {
		console.log(global)
	}, [global]);

	return <DashboardContent
		titulo={isEditMode ? 'Editar Venda Status' : 'Novo Venda Status'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastros/venda-status`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!vendaStatus && isFetching) ? <Carregando /> :
			(!vendaStatus && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
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
								name={`global`}
								control={control}
								render={({ field, fieldState }) => (<>
									<FormControlLabel
										control={<Switch {...field} checked={field.value} disabled={isEditMode || !usuarioLogado?.isAdmin}/>}
										labelPlacement='start'
										label="Global"
									/>
									<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</>
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
												endAdornment: <InputAdornment position="end"><Icon>{field.value}</Icon></InputAdornment>,
											}
										}}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`cor`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										fullWidth
										variant='filled'
										label="Cor"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										slotProps={{
											htmlInput: {
												maxLength: 6,
											},
											input: {
												startAdornment: <InputAdornment position="start">#</InputAdornment>,
												endAdornment: <InputAdornment position="end"><Icon sx={{ color: "#" + field.value }}>square</Icon></InputAdornment>,
											}
										}}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`categoria`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Categoria</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Categoria"
											>
												<MenuItem value=''><em>Selecione</em></MenuItem>
												{Object.keys(VendaStatusCategoriaSchema.enum).map((categoria) => <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`ordem`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Ordem"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
										type="number"
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
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`tipo`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Tipo</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Tipo"
											>
												<MenuItem value=''><em>Selecione</em></MenuItem>
												{Object.keys(VendaStatusTipoSchema.enum).map((tipo) => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
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

export default VendaStatusFormPage;