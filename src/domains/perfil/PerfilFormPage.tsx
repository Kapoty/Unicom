import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Badge as BadgeIcon, CloudUpload, Delete, Edit, Person, PersonSearch } from "@mui/icons-material";
import { Alert, Avatar, Box, Chip, Fab, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, InputLabel, MenuItem, Select, SvgIcon, Switch, TextField, Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import NoImageIcon from '../../assets/svg/no-image.svg';
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import DashboardContentTab from "../../shared/components/Dashboard/DashboardContentTab";
import DashboardContentTabs from "../../shared/components/Dashboard/DashboardContentTabs";
import CustomFab from "../../shared/components/Fab/CustomFab";
import Carregando from "../../shared/components/Feedback/Carregando";
import useFormFabs from "../../shared/components/Form/useFormFabs";
import useHandleDiscardChanges from "../../shared/components/Form/useHandleDiscardChanges";
import useHandleServerErrors from "../../shared/components/Form/useHandleServerErrors";
import useBlockNavigation from "../../shared/hooks/useBlockNavigation";
import useEmpresaIdParam from "../../shared/hooks/useEmpresaIdParam";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import { toBase64 } from "../../shared/utils/fileUtils";
import { usePapeisQuery, usePapelAtualQuery } from "../papel/PapelQueries";
import { useUsuarioLogadoQuery, useUsuarioPublicByUsuarioIdQuery } from "../usuario/UsuarioQueries";
import { usePerfilAdminByEmpresaIdAndPerfilIdQuery } from "./PerfilQueries";
import { getArquivoUrl } from "./PerfilService";
import UsuarioChip from "../usuario/UsuarioChip";
import { IPerfilAdmin } from "./PerfilUsuarioShared";
import EmpresaChip from "../empresa/EmpresaChip";
import UsuarioBuscarFormDialog from "../usuario/UsuarioBuscarFormDialog";
import { IUsuarioPublic } from "../usuario/Usuario";
import { usePerfilPatchMutation, usePerfilPostMutation } from "./PerfilMutations";
import { PerfilAdminPatchRequestSchema, PerfilAdminPostRequestSchema } from "./PerfilPayloads";

const PerfilFormSchema = z.object({
	foto: z.nullable(z.string()),
	novaFoto: z.optional(z.nullable(z.string())),
	nome: z.string().min(1, 'obrigatório').max(200),
	ativo: z.boolean(),
	aceito: z.boolean(),
	usuarioId: z.number(),
	papelId: z.number(),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type PerfilFormData = z.infer<typeof PerfilFormSchema>;

const PerfilFormPage = () => {

	const { perfilId: perfilIdParam } = useParams();
	const perfilId = parseInt(perfilIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = perfilIdParam !== 'add';

	const [perfil, setPerfil] = useState<IPerfilAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const { data, refetch, isFetching, error } = usePerfilAdminByEmpresaIdAndPerfilIdQuery(empresaId, isEditMode ? perfilId : undefined);

	const { mutateAsync: postPerfil } = usePerfilPostMutation();
	const { mutateAsync: patchPerfil } = usePerfilPatchMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control,
		watch
	} = useForm<PerfilFormData>({
		defaultValues: {
			foto: null,
			novaFoto: undefined,
			nome: '',
			ativo: false,
			aceito: false,
			usuarioId: -1,
			papelId: -1,
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(PerfilFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: PerfilFormData) => {
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

	const patch = async (data: PerfilFormData) => {
		const response = await patchPerfil({
			empresaId: empresaId!,
			perfilId: perfilId!,
			payload: PerfilAdminPatchRequestSchema.parse({
				...data,
				foto: undefined,
				...(novaFoto !== undefined ? {foto: novaFoto} : {}),
				papelId: data.papelId > 0 ? data.papelId : null,
				usuarioId: data.usuarioId > 0 ? data.usuarioId : null,
			}),
		});
		reset();
		setPerfil(response);
	}

	const post = async (data: PerfilFormData) => {
		const response = await postPerfil({
			empresaId: empresaId!,
			payload: PerfilAdminPostRequestSchema.parse({
				...data,
				foto: novaFoto == undefined ? null : novaFoto,
				papelId: data.papelId > 0 ? data.papelId : null,
				usuarioId: data.usuarioId > 0 ? data.usuarioId : null,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/perfis/${response.perfilId}`);
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setPerfil(result.data!);
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
		if (perfil)
			reset(PerfilFormSchema.parse({
				...perfil,
				usuarioId: perfil?.usuarioId ? perfil.usuarioId : -1,
				foto: perfil?.foto ?? null,
				novaFoto: undefined,
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [perfil]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['foto', 'nome', 'ativo', 'papelId'].some(r => keys.includes(r));
				break;
			case 1:
				return ['usuarioId', 'aceito'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges);

	const {data: usuarioLogado} = useUsuarioLogadoQuery();

	const {data: papeis} = usePapeisQuery();
	const {data: papelAtual} = usePapelAtualQuery();
	const papeisAbaixo = usuarioLogado?.isAdmin ? papeis : papeis?.filter(papel => papelAtual?.papeisAbaixo?.includes(papel.papelId) ?? false);

	const foto = watch('foto');
	const novaFoto = watch('novaFoto');
	
	const handleFotoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			toBase64(file).then((base64) => {
				if (!base64?.startsWith('data:image/png;base64'))
					throw new Error();
				setValue('novaFoto', base64?.toString(), {shouldDirty: true});
			}).catch((error) => {
				console.error(error);
				enqueueSnackbar({message: 'Arquivo inválido!', variant: 'error'});
			});
		}
	}

	const handleFotoDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setValue('novaFoto', null, {shouldDirty: true});
	}

	const usuarioId = watch('usuarioId');
	const aceito = watch('aceito');
	const {data: usuario, isLoading: isUsuarioLoading, error: usuarioError} = useUsuarioPublicByUsuarioIdQuery(usuarioId > 0 ? usuarioId : undefined);
	const [usuarioBuscarDialogOpen, setUsuarioBuscarDialogOpen] = useState(false);

	const handleUsuarioEditar = async (usuarioId: number) => {
		browserHistory.push(`/e/${empresaId}/usuarios/${usuarioId}`);
	}

	const handleUsuarioDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setValue('usuarioId', -1, {shouldDirty: true});
	}

	const handleUsuarioAlterar: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setUsuarioBuscarDialogOpen(true);
	}

	const onUsuarioDialogSave = (usuario: IUsuarioPublic) => {
		if (usuario.empresaPrincipal.empresaId == empresaId) {
			enqueueSnackbar('Usuário deve ser de outra empresa!', {variant: 'error'});
		} else {
			setValue('usuarioId', usuario.usuarioId, {shouldDirty: true});
			setValue('aceito', false, {shouldDirty: true});
		}
		onUsuarioDialogClose();
	}

	const onUsuarioDialogClose = () => {
		setUsuarioBuscarDialogOpen(false);
	}

	return <><DashboardContent
		titulo={isEditMode ? 'Editar Perfil' : 'Novo Perfil'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/perfis`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!perfil && isFetching) ? <Carregando /> :
			(!perfil && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<BadgeIcon />} label="Perfil" key={0} />,
						<DashboardContentTab error={hasTabError(1)} icon={<Person />} label="Usuário" key={1} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					<Grid container spacing={1}>
						<Grid container size={12}>
							<Grid size={12} container justifyContent='center'>
								<Chip label="Foto"/>
							</Grid>
							<Grid size={12} container justifyContent='center'>
								{novaFoto === undefined ? <Avatar variant='square' sx={{width: 128, height: 128}} src={foto !== null ? getArquivoUrl(perfilId!, foto!) : undefined}><SvgIcon component={NoImageIcon} inheritViewBox /></Avatar>
								: <Avatar variant='square' sx={{width: 128, height: 128}} src={novaFoto ?? undefined}><SvgIcon component={NoImageIcon} inheritViewBox /></Avatar>}
							</Grid>
							<Grid size={12} container justifyContent='center' gap={1}>
								<Tooltip title='Alterar'>
									<Box>
										<Fab component='label' size='small'>
											<CloudUpload />
											<input type="file" accept="image/png" id="foto-perfil" hidden onChange={handleFotoChange} />
										</Fab>
									</Box>
								</Tooltip>
								{(foto || novaFoto) && novaFoto !== null &&
									<Tooltip title='Excluir'>
										<Box>
											<Fab color='error' onClick={handleFotoDelete} size='small'>
												<Delete />
											</Fab>
										</Box>
									</Tooltip>
								}
							</Grid>
							{errors?.foto && <Grid size={12}><Alert severity='error'>{errors?.foto.message}</Alert></Grid>}
						</Grid>
						<Grid size={{ xs: 12, md: 12 }}>
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
												<MenuItem value={-1}><em>Selecione</em></MenuItem>
												{(papeisAbaixo ?? []).map((papel) => <MenuItem key={papel.papelId} value={papel.papelId}>{papel.nome}</MenuItem>)}
											</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
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
					<Grid container size={12}>
							<Grid size={12} container justifyContent='center'>
								<Chip label="Usuário"/>
							</Grid>
							<Grid size={12} container justifyContent='center' gap={1}>
								{usuarioId == -1 ? <Alert severity='info'>Nenhum usuário vinculado a este perfil</Alert>
								: <>
									<EmpresaChip empresaId={usuario?.empresaPrincipal?.empresaId}/>
									<UsuarioChip usuarioId={usuarioId}/>
									{usuario?.empresaPrincipal?.empresaId !== empresaId && <Chip color={aceito ? 'success' : 'default'} label={aceito ? 'Aceito' : 'Aceitação Pendente'}/>}
								</>}
							</Grid>
							<Grid size={12} container justifyContent='center' gap={1}>
								{usuario && usuario?.empresaPrincipal?.empresaId == empresaId! && <Tooltip color="warning" title="Editar">
									<Fab size="small" onClick={() => handleUsuarioEditar(usuario?.usuarioId)}>
										<Edit />
									</Fab>
								</Tooltip>}
								{(usuarioId == -1 || (usuario && usuario?.empresaPrincipal?.empresaId !== empresaId!)) && <Tooltip title='Alterar'>
									<Box>
										<Fab size='small' onClick={handleUsuarioAlterar}>
											<PersonSearch />
										</Fab>
									</Box>
								</Tooltip>}
								{usuario && usuario?.empresaPrincipal?.empresaId !== empresaId! &&
									<Tooltip title='Excluir'>
										<Box>
											<Fab color='error' onClick={handleUsuarioDelete} size='small'>
												<Delete />
											</Fab>
										</Box>
									</Tooltip>}
							</Grid>
							{errors?.foto && <Grid size={12}><Alert severity='error'>{errors?.foto.message}</Alert></Grid>}
						</Grid>
					</Grid>
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
	{usuarioBuscarDialogOpen && <UsuarioBuscarFormDialog onClose={onUsuarioDialogClose} onSave={onUsuarioDialogSave}/>}
	</>
}

export default PerfilFormPage;