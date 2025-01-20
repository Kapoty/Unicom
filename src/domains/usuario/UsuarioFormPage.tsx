import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, AttachFile, Badge, Check, Circle, CloudUpload, Delete, DeleteForever, Description, Devices, Edit, FiberPin, Key, Recycling, Refresh, Restore, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Chip, Divider, FormControl, FormHelperText, Grid2 as Grid, IconButton, InputAdornment, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Stack, TextField, Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useConfirm } from "../../shared/components/ConfirmDialog/ConfirmProvider";
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
import DispositivoChip from "../dispositivo/DispositivoChip";
import { useDispositivoExcluirMutation } from "../dispositivo/DispositivoMutations";
import { useDispositivosByUsuarioIdQuery } from "../dispositivo/DispositivoQueries";
import EmpresaChip from "../empresa/EmpresaChip";
import PerfilChip from "../perfil/PerfilChip";
import { usePerfilAceitarMutation, usePerfilRecusarMutation } from "../perfil/PerfilMutations";
import { usePerfisByUsuarioIdAndEmpresaIdQuery } from "../perfil/PerfilQueries";
import { IUsuarioAdmin, PapelSistemaSchema } from "./Usuario";
import { useUsuarioPatchMutation, useUsuarioPostMutation } from "./UsuarioMutations";
import { UsuarioPatchRequestSchema, UsuarioPostRequestSchema } from "./UsuarioPayloads";
import { useUsuarioAdminByEmpresaIdAndUsuarioIdQuery, useUsuarioLogadoQuery } from "./UsuarioQueries";
import { getRefreshToken } from "../../shared/utils/authUtil";
import { useAnexosByUsuarioIdQuery } from "../anexo/AnexoQueries";
import { useAnexoDeleteByUsuarioIdAndFileIdMutation, useAnexoTrashByUsuarioIdAndFileIdMutation, useAnexoUntrashByUsuarioIdAndFileIdMutation, useAnexoUploadByUsuarioIdMutation } from "../anexo/AnexoMutations";
import AnexoChip from "../anexo/AnexoChip";
import { usePapelAtualQuery } from "../papel/PapelQueries";

const UsuarioFormSchema = z.object({
	nomeCompleto: z.string().min(1, 'obrigatório').max(200),
	email: z.string().email('inválido'),
	matricula: z.string().regex(/(^\d+$)|^$/, 'somente números'),
	senha: z.string().regex(/(^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{8,16}$)|(^$)/, 'ao menos uma letra e um número, de 8 a 16 caracteres'),
	confirmacaoSenha: z.string(),
	pin: z.string().regex(/(^[1-9]{1}\d{5}$)|(^$)/, '6 números, não iniciado por 0'),
	confirmacaoPin: z.string(),
	papelSistema: PapelSistemaSchema,
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type UsuarioFormData = z.infer<typeof UsuarioFormSchema>;

const UsuarioFormPage = () => {

	const { usuarioId: usuarioIdParam } = useParams();
	const usuarioId = parseInt(usuarioIdParam!);

	const empresaId = useEmpresaIdParam();

	const isEditMode = usuarioIdParam !== 'add';

	const [usuario, setUsuario] = useState<IUsuarioAdmin>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const { data: usuarioLogado } = useUsuarioLogadoQuery();

	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [mostrarPin, setMostrarPin] = useState(false);

	const { enqueueSnackbar } = useSnackbar();
	const { confirm } = useConfirm();

	const { data, refetch, isFetching, error } = useUsuarioAdminByEmpresaIdAndUsuarioIdQuery(empresaId, isEditMode ? usuarioId : undefined);

	const { mutateAsync: postUsuario } = useUsuarioPostMutation();
	const { mutateAsync: patchUsuario } = useUsuarioPatchMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<UsuarioFormData>({
		defaultValues: {
			nomeCompleto: '',
			email: '',
			matricula: '',
			senha: '',
			confirmacaoSenha: '',
			pin: '',
			confirmacaoPin: '',
			papelSistema: PapelSistemaSchema.Enum.USUARIO,
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(UsuarioFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: UsuarioFormData) => {
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

	const patch = async (data: UsuarioFormData) => {
		const response = await patchUsuario({
			empresaId: empresaId!,
			usuarioId: usuarioId!,
			payload: UsuarioPatchRequestSchema.parse({
				...data,
				matricula: data.matricula !== '' ? parseInt(data.matricula) : null,
				...(data.senha !== '' ? {
					senha: data.senha,
					confirmacaoSenha: data.confirmacaoSenha,
				} : {
					senha: undefined,
					confirmacaoSenha: undefined,
				}),
				...(data.pin !== '' ? {
					pin: data.pin,
				} : {
					pin: undefined,
				})
			}),
		});
		reset();
		setUsuario(response);
	}

	const post = async (data: UsuarioFormData) => {
		const response = await postUsuario({
			empresaId: empresaId!,
			payload: UsuarioPostRequestSchema.parse({
				...data,
				matricula: data.matricula !== '' ? parseInt(data.matricula) : null,
				pin: data.pin !== '' ? data.pin : null,
			}),
		});
		unblockNavigation?.();
		browserHistory.push(`/e/${empresaId}/usuarios/${response.usuarioId}`);
	}

	const handleDiscardChanges = useHandleDiscardChanges(reset);

	const update = useCallback(async () => {
		setIsUpdating(true);
		try {
			const result = await refetch();
			if (result.error)
				throw error;
			setUsuario(result.data!);
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
		if (usuario)
			reset(UsuarioFormSchema.parse({
				...usuario,
				matricula: usuario?.matricula?.toString() ?? '',
				senha: '',
				confirmacaoSenha: '',
				pin: '',
				confirmacaoPin: '',
			}), {
				keepDirty: true,
				keepDirtyValues: true,
			});
	}, [usuario]);

	const updatedAt = useWatch({ control, name: 'updatedAt' });

	useEffect(() => {
		if (updatedAt && data)
			setIsNewDataAvailable(!data.updatedAt.isSame(updatedAt));
	}, [updatedAt, data]);

	const hasTabError = useCallback((tab: number) => {
		let keys = Object.keys(errors);
		switch (tab) {
			case 0:
				return ['nomeCompleto', 'email', 'matricula', 'papelSistema'].some(r => keys.includes(r));
				break;
			case 1:
				return ['senha', 'confirmacaoSenha', 'pin', 'confirmacaoPin'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges);

	const { data: perfis, refetch: refetchPerfis, isFetching: isPerfisFetching } = usePerfisByUsuarioIdAndEmpresaIdQuery(usuarioId, empresaId);
	const { mutateAsync: aceitarPerfil } = usePerfilAceitarMutation();
	const { mutateAsync: recusarPerfil } = usePerfilRecusarMutation();

	const handleAceitarPerfil = async (perfilId: number) => {
		try {
			await aceitarPerfil({ perfilId: perfilId });
			enqueueSnackbar('Perfil aceito!', { variant: 'success' });
			refetchPerfis();
		} catch (error: any) {
			enqueueSnackbar('Falha ao aceitar perfil!', { variant: 'error' });
		}
	}

	const handleRecusarPerfil = async (perfilId: number) => {
		try {
			if (await confirm({
				title: "Excluir perfil?",
				message: 'Atenção: essa ação não poderá ser desfeita!',
				cancelText: 'Cancelar',
				confirmColor: 'error',
				confirmText: 'Excluir',
				confirmIcon: <Delete />,
			})) {
				await recusarPerfil({ perfilId: perfilId });
				enqueueSnackbar('Perfil excluído!', { variant: 'success' });
				refetchPerfis();
			}
		} catch (error: any) {
			enqueueSnackbar('Falha ao excluir perfil!', { variant: 'error' });
		}
	}

	const handleEditarPerfil = async (perfilId: number) => {
		browserHistory.push(`/e/${empresaId}/perfis/${perfilId}`);
	}

	const { data: dispositivos, refetch: refetchDispositivos, isFetching: isDispositivosFetching } = useDispositivosByUsuarioIdQuery(usuarioId);
	const { mutateAsync: excluirDispositivo } = useDispositivoExcluirMutation();

	const refreshToken = getRefreshToken();

	const handleExcluirDispositivo = async (token: string) => {
		try {
			if (await confirm({
				title: "Excluir dispositivo?",
				message: 'Atenção: será necessário realizar o login novamente neste dispositivo!',
				cancelText: 'Cancelar',
				confirmColor: 'error',
				confirmText: 'Excluir',
				confirmIcon: <Delete />,
			})) {
				await excluirDispositivo({ token: token });
				enqueueSnackbar('Dispositivo excluído!', { variant: 'success' });
				refetchDispositivos();
			}
		} catch (error: any) {
			enqueueSnackbar('Falha ao excluir dispositivo!', { variant: 'error' });
		}
	}

	const { data: papel } = usePapelAtualQuery();

	const { data: anexos, refetch: refetchAnexos, isFetching: isAnexosFetching } = useAnexosByUsuarioIdQuery(usuarioId);
	const { mutateAsync: uploadAnexo, isPending: isAnexoUploading } = useAnexoUploadByUsuarioIdMutation();
	const { mutateAsync: trashAnexo } = useAnexoTrashByUsuarioIdAndFileIdMutation();
	const { mutateAsync: untrashAnexo } = useAnexoUntrashByUsuarioIdAndFileIdMutation();
	const { mutateAsync: deleteAnexo } = useAnexoDeleteByUsuarioIdAndFileIdMutation();

	const handleUploadAnexo: ChangeEventHandler<HTMLInputElement> = async (event) => {
		try {
			let file = event.target?.files?.[0];
			if (file) {
				await uploadAnexo({ usuarioId: usuarioId, file: file });
				enqueueSnackbar('Anexo adicionado com sucesso!', { variant: 'success' });
				refetchAnexos();
			}
		} catch (error: any) {
			enqueueSnackbar('Falha ao excluir anexo!', { variant: 'error' });
		} finally {
			event.target.value = "";
		}
	}

	const handleTrashAnexo = async (fileId: string) => {
		try {
			if (await confirm({
				title: "Excluir anexo?",
				cancelText: 'Cancelar',
				confirmColor: 'error',
				confirmText: 'Excluir',
				confirmIcon: <Delete />,
			})) {
				await trashAnexo({ usuarioId: usuarioId, fileId: fileId });
				enqueueSnackbar('Anexo excluído!', { variant: 'success' });
				refetchAnexos();
			}
		} catch (error: any) {
			enqueueSnackbar('Falha ao excluir anexo!', { variant: 'error' });
		}
	}

	const handleUntrashAnexo = async (fileId: string) => {
		try {
			await untrashAnexo({ usuarioId: usuarioId, fileId: fileId });
			enqueueSnackbar('Anexo restaurado!', { variant: 'success' });
			refetchAnexos();
		} catch (error: any) {
			enqueueSnackbar('Falha ao restaurar anexo!', { variant: 'error' });
		}
	}

	const handleDeleteAnexo = async (fileId: string) => {
		try {
			if (await confirm({
				title: "Excluir anexo permanentemente?",
				message: 'Atenção: essa ação não poderá ser revertida!',
				cancelText: 'Cancelar',
				confirmColor: 'error',
				confirmText: 'Excluir',
				confirmIcon: <Delete />,
			})) {
				await deleteAnexo({ usuarioId: usuarioId, fileId: fileId });
				enqueueSnackbar('Anexo excluído permanentemente!', { variant: 'success' });
				refetchAnexos();
			}
		} catch (error: any) {
			enqueueSnackbar('Falha ao excluir anexo permanentemente!', { variant: 'error' });
		}
	}

	return <DashboardContent
		titulo={isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.push(`/e/${empresaId}/usuarios`)} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!usuario && isFetching) ? <Carregando /> :
			(!usuario && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab error={hasTabError(0)} icon={<Description />} label="Informações Básicas" key={0} />,
						<DashboardContentTab error={hasTabError(1)} icon={<Key />} label="Senhas" key={0} />,
						<DashboardContentTab icon={<Badge />} label="Perfis" key={1} />,
						<DashboardContentTab icon={<Devices />} label="Dispositivos Conectados" key={2} />,
						<DashboardContentTab icon={<AttachFile />} label="Anexos" key={3} />,
					]}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
				>
					<Grid container spacing={1}>
						<Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`nomeCompleto`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Nome Completo"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 8 }}>
							<Controller
								name={`email`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										required
										fullWidth
										variant='filled'
										label="Email"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 4 }}>
							<Controller
								name={`matricula`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										fullWidth
										variant='filled'
										label="Matrícula"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						{usuarioLogado?.isAdmin && <Grid size={{ xs: 12, md: 12 }}>
							<Controller
								name={`papelSistema`}
								control={control}
								render={({ field, fieldState }) => (
									<FormControl fullWidth required error={!!(fieldState?.error)}>
										<InputLabel>Papel (Sistema)</InputLabel>
										<Select
											{...field}
											variant="filled"
											label="Papel (Sistema)"
										>
											{Object.keys(PapelSistemaSchema.enum).map((papel) => <MenuItem key={papel} value={papel}>{papel}</MenuItem>)}
										</Select>
										<FormHelperText error>{fieldState?.error?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>}
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
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`senha`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										{...(!isEditMode ? { required: true } : {})}
										fullWidth
										type={mostrarSenha ? "text" : "password"}
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<Key />
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => setMostrarSenha(!mostrarSenha)}
															edge="end"
														>
															{mostrarSenha ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												),
												autoComplete: 'new-password'
											}
										}}
										variant='filled'
										label="Senha"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message ?? (isEditMode && "deixe em branco se não for alterar")}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`confirmacaoSenha`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										{...(!isEditMode ? { required: true } : {})}
										type={mostrarSenha ? "text" : "password"}
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<Key />
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => setMostrarSenha(!mostrarSenha)}
															edge="end"
														>
															{mostrarSenha ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												),
												autoComplete: 'new-password'
											}
										}}
										fullWidth
										variant='filled'
										label="Confirmação de Senha"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`pin`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										type={mostrarPin ? "text" : "password"}
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<FiberPin />
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => setMostrarPin(!mostrarPin)}
															edge="end"
														>
															{mostrarPin ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												),
											}
										}}
										fullWidth
										variant='filled'
										label="PIN"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message ?? (isEditMode && "deixe em branco se não for alterar")}
									/>
								)}
							/>
						</Grid>
						<Grid size={{ xs: 6, md: 6 }}>
							<Controller
								name={`confirmacaoPin`}
								control={control}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										type={mostrarPin ? "text" : "password"}
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<FiberPin />
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => setMostrarPin(!mostrarPin)}
															edge="end"
														>
															{mostrarPin ? <VisibilityOff /> : <Visibility />}
														</IconButton>
													</InputAdornment>
												),
											}
										}}
										fullWidth
										variant='filled'
										label="Confirmação de PIN"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>
					<Grid container spacing={1}>
						{!isEditMode ? <Grid size={12}>
							<Alert severity='info'>Você poderá ver os perfis assim que salvar o usuário</Alert>
						</Grid> :
							<Stack gap={1} width={1}>
								<LoadingButton loading={isPerfisFetching} variant="contained" startIcon={<Refresh />} fullWidth onClick={() => refetchPerfis()}>
									Atualizar
								</LoadingButton>
								<List
									dense
									disablePadding
									sx={{
										'& .MuiListItemIcon-root': {
											pl: 1,
											justifyContent: 'end',
										},
									}}>
									{perfis?.map(perfil => <ListItemButton key={perfil.perfilId}>
										<ListItemText>
											<Stack direction='row' gap={1}>
												<EmpresaChip empresaId={perfil.empresaId} />
												<PerfilChip perfil={perfil} />
												{perfil?.empresaId == usuario?.empresaPrincipalId && <Chip label='Principal'/>}
												{perfil?.empresaId !== usuario?.empresaPrincipalId && <Chip color={perfil?.aceito ? 'success' : 'default'} label={perfil?.aceito ? 'Aceito' : 'Aceitação Pendente'}/>}
											</Stack>
										</ListItemText>
										<ListItemIcon>
											{perfil.empresaId == empresaId! && <Tooltip color="warning" title="Editar">
												<IconButton size="small" onClick={() => handleEditarPerfil(perfil.perfilId)}>
													<Edit />
												</IconButton>
											</Tooltip>}
											{!perfil.aceito && <Tooltip title="Aceitar">
												<IconButton color="success" size="small" onClick={() => handleAceitarPerfil(perfil.perfilId)}>
													<Check />
												</IconButton>
											</Tooltip>}
											{!(perfil.empresaId == empresaId!) && <Tooltip color="error" title="Excluir">
												<IconButton size="small" onClick={() => handleRecusarPerfil(perfil.perfilId)}>
													<Delete />
												</IconButton>
											</Tooltip>}
										</ListItemIcon>
									</ListItemButton >)}
								</List>
							</Stack>
						}
					</Grid>
					<Grid container spacing={1}>
						{!isEditMode ? <Grid size={12}>
							<Alert severity='info'>Você poderá ver os dispositivos assim que salvar o usuário</Alert>
						</Grid> :
							<Stack gap={1} width={1}>
								<LoadingButton loading={isDispositivosFetching} variant="contained" startIcon={<Refresh />} fullWidth onClick={() => refetchDispositivos()}>
									Atualizar
								</LoadingButton>
								<List
									dense
									disablePadding
									sx={{
										'& .MuiListItemIcon-root': {
											pl: 1,
											justifyContent: 'end',
										},
									}}>
									{dispositivos?.map(dispositivo => <ListItemButton key={dispositivo.token}>
										<ListItemText>
											<Stack direction='row' gap={1}>
												<DispositivoChip dispositivo={dispositivo} />
											</Stack>
										</ListItemText>
										<ListItemIcon>
											{dispositivo.token !== refreshToken && <Tooltip color="error" title="Excluir">
												<IconButton size="small" onClick={() => handleExcluirDispositivo(dispositivo.token)}>
													<Delete />
												</IconButton>
											</Tooltip>}
											{dispositivo.token == refreshToken && <Tooltip color="error" title="Dispositivo Atual">
												<Circle color='success' />
											</Tooltip>}
										</ListItemIcon>
									</ListItemButton >)}
								</List>
							</Stack>
						}
					</Grid>
					<Grid container spacing={1}>
						{!isEditMode ? <Grid size={12}>
							<Alert severity='info'>Você poderá ver os anexos assim que salvar o usuário</Alert>
						</Grid> : <>
							<Grid size={6}>
								<LoadingButton loading={isAnexosFetching} variant="contained" startIcon={<Refresh />} fullWidth onClick={() => refetchAnexos()}>
									Atualizar
								</LoadingButton>
							</Grid>
							<Grid size={6}>
								<LoadingButton loading={isAnexoUploading} component="label" variant="contained" startIcon={<CloudUpload />} fullWidth>
									Adicionar Anexo
									<input type="file" id="anexo" hidden onChange={handleUploadAnexo} />
								</LoadingButton>
							</Grid>
							<Grid size={12}>
								<List
									dense
									disablePadding
									sx={{
										'& .MuiListItemIcon-root': {
											pl: 1,
											justifyContent: 'end',
										},
									}}>
									{anexos?.filter(anexo => !anexo.trashed)?.map(anexo => <ListItemButton key={anexo.id}>
										<ListItemText>
											<Stack direction='row' gap={1}>
												<AnexoChip anexo={anexo} />
											</Stack>
										</ListItemText>
										<ListItemIcon>
											<Tooltip color="error" title="Excluir">
												<IconButton size="small" onClick={() => handleTrashAnexo(anexo.id)}>
													<Delete />
												</IconButton>
											</Tooltip>
										</ListItemIcon>
									</ListItemButton >)}
								</List>
							</Grid>
							{(usuarioLogado?.isAdmin || papel?.contemPermissao('VER_LIXEIRA')) && <>
								<Grid size={12}>
									<Divider><Chip icon={<Recycling />} label="Lixeira" /></Divider>
								</Grid>
								<Grid size={12}>
									<Alert severity="warning">Os itens da lixeira serão excluídos definitivamente após 30 dias</Alert>
								</Grid>
								<Grid size={12}>
									<List
										dense
										disablePadding
										sx={{
											'& .MuiListItemIcon-root': {
												pl: 1,
												justifyContent: 'end',
											},
										}}>
										{anexos?.filter(anexo => anexo.trashed)?.map(anexo => <ListItemButton key={anexo.id}>
											<ListItemText>
												<Stack direction='row' gap={1}>
													<AnexoChip anexo={anexo} />
												</Stack>
											</ListItemText>
											<ListItemIcon>
												<Tooltip color="success" title="Restaurar">
													<IconButton size="small" onClick={() => handleUntrashAnexo(anexo.id)}>
														<Restore />
													</IconButton>
												</Tooltip>
												<Tooltip color="error" title="Excluir Permanentemente">
													<IconButton size="small" onClick={() => handleDeleteAnexo(anexo.id)}>
														<DeleteForever />
													</IconButton>
												</Tooltip>
											</ListItemIcon>
										</ListItemButton >)}
									</List>
								</Grid>
							</>}
						</>}
					</Grid>
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
}

export default UsuarioFormPage;