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
import { useRelatorioByEmpresaIdAndRelatorioIdQuery } from "./RelatorioQueries";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import { useRelatorioDeleteMutation, useRelatorioPatchMutation, useRelatorioPostMutation } from "./RelatorioMutations";
import { IRelatorioAdmin } from "./Relatorio";
import { RelatorioPatchRequestSchema, RelatorioPostRequestSchema } from "./RelatorioPayloads";
import { usePapeisQuery } from "../papel/PapelQueries";
import useHandleDelete from "../../shared/components/Form/useHandleDelete";

const RelatorioFormSchema = z.object({
	titulo: z.string().min(1, 'obrigatório').max(100),
	uri: z.string().min(1, 'obrigatório').max(100).regex(/^[a-z0-9-]+$/, 'caracteres aceitos: [a-z][0-9]-'),
	link: z.string().min(1, 'obrigatório').max(500),
	linkMobile: z.string().max(500),
	icone: z.string().max(50),
	ativo: z.boolean(),
	novaGuia: z.boolean(),
	papelId: z.number(),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type RelatorioFormData = z.infer<typeof RelatorioFormSchema>;

const RelatorioFormPage = () => {

	const { relatorioId: relatorioIdParam } = useParams();
	const relatorioId = parseInt(relatorioIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = relatorioIdParam !== 'add';

	const [relatorio, setRelatorio] = useState<IRelatorioAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = useRelatorioByEmpresaIdAndRelatorioIdQuery(empresaId, isEditMode ? relatorioId : undefined);

	const { mutateAsync: postRelatorio } = useRelatorioPostMutation();
	const { mutateAsync: patchRelatorio } = useRelatorioPatchMutation();
	const { mutateAsync: deleteRelatorio } = useRelatorioDeleteMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<RelatorioFormData>({
		defaultValues: {
			titulo: '',
			uri: '',
			link: '',
			linkMobile: '',
			icone: '',
			ativo: true,
			novaGuia: false,
			papelId: -1,
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(RelatorioFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: RelatorioFormData) => {
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

	const patch = async (data: RelatorioFormData) => {
		const response = await patchRelatorio({
			empresaId: empresaId!,
			relatorioId: relatorioId!,
			payload: RelatorioPatchRequestSchema.parse({
				...data,
				linkMobile: data.linkMobile !== '' ? data.linkMobile : null,
				icone: data.icone !== '' ? data.icone : null,
				papelId: data.papelId > 0 ? data.papelId : null,
			}),
		});
		reset();
		setRelatorio(response);
	}

	const post = async (data: RelatorioFormData) => {
		const response = await postRelatorio({
			empresaId: empresaId!,
			payload: RelatorioPostRequestSchema.parse({
				...data,
				linkMobile: data.linkMobile !== '' ? data.linkMobile : null,
				icone: data.icone !== '' ? data.icone : null,
				papelId: data.papelId > 0 ? data.papelId : null,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/cadastrar-relatorios/${response.relatorioId}`);
	}

	const _delete = async () => {
		try {
			const response = await deleteRelatorio({
				empresaId: empresaId!,
				relatorioId: relatorioId!,
			});
			enqueueSnackbar('Excluído com sucesso!', { variant: 'success' });
			unblockNavigation?.();
			browserHistory.push(`/e/${empresaId}/cadastrar-relatorios`);
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
			setRelatorio(result.data!);
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
		if (relatorio)
			reset(RelatorioFormSchema.parse({
				...relatorio,
				linkMobile: relatorio?.linkMobile ?? '',
				icone: relatorio?.icone ?? '',
				papelId: relatorio?.papelId ?? -1,
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [relatorio]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['titulo', 'uri', 'link', 'linkMobile', 'icone', 'ativo', 'novaGuia', 'papelId'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges, handleDelete);

	const {data: papeis} = usePapeisQuery();

	return <DashboardContent
		titulo={isEditMode ? 'Editar Relatório' : 'Novo Relatório'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/cadastrar-relatorios`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!relatorio && isFetching) ? <Carregando /> :
			(!relatorio && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
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
								name={`titulo`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Título"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Controller
								name={`uri`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="URI"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`link`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Link"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`linkMobile`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										fullWidth
										variant='filled'
										label="Link Mobile"
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
												endAdornment: <InputAdornment position="end"><Icon>{field.value !== '' ? field.value : 'leaderboard'}</Icon></InputAdornment>,
											}
										}}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`ativo`}
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
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`papelId`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Papel</InputLabel>
											<Select
												{...field}
												variant="filled"
												label="Papel"
											>
												<MenuItem value={-1}><em>Todos</em></MenuItem>
												{(papeis ?? []).map((papel) => <MenuItem key={papel.papelId} value={papel.papelId}>{papel.nome}</MenuItem>)}
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

export default RelatorioFormPage;