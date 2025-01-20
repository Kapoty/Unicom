import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, Badge, Circle, Delete, Description, Devices, FiberPin, Key, Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Chip, Grid2 as Grid, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { getRefreshToken } from "../../shared/utils/authUtil";
import browserHistory from "../../shared/utils/browserHistory";
import { dateValidationSchema } from "../../shared/utils/dateUtils";
import DispositivoChip from "../dispositivo/DispositivoChip";
import { useDispositivoExcluirMutation } from "../dispositivo/DispositivoMutations";
import { useDispositivosByUsuarioIdQuery } from "../dispositivo/DispositivoQueries";
import EmpresaChip from "../empresa/EmpresaChip";
import PerfilChip from "../perfil/PerfilChip";
import { usePerfisByUsuarioIdAndEmpresaIdQuery } from "../perfil/PerfilQueries";
import { IUsuarioMe } from "./Usuario";
import { useUsuarioMePatchMutation, useUsuarioPatchMutation, useUsuarioPostMutation } from "./UsuarioMutations";
import { UsuarioMePatchRequestSchema, UsuarioPatchRequestSchema } from "./UsuarioPayloads";
import { useUsuarioLogadoQuery } from "./UsuarioQueries";

const UsuarioMeFormSchema = z.object({
	nomeCompleto: z.string().min(1, 'obrigatório').max(200),
	email: z.string().email('inválido'),
	matricula: z.string().regex(/(^\d+$)|^$/, 'somente números'),
	senha: z.string().regex(/(^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{8,16}$)|(^$)/, 'ao menos uma letra e um número, de 8 a 16 caracteres'),
	confirmacaoSenha: z.string(),
	pin: z.string().regex(/(^[1-9]{1}\d{5}$)|(^$)/, '6 números, não iniciado por 0'),
	confirmacaoPin: z.string(),
	createdAt: z.nullable(dateValidationSchema),
	updatedAt: z.nullable(dateValidationSchema),
});

type UsuarioMeFormData = z.infer<typeof UsuarioMeFormSchema>;

const UsuarioMeFormPage = () => {

	const empresaId = useEmpresaIdParam();

	const isEditMode = true;

	const [usuario, setUsuario] = useState<IUsuarioMe>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateRequired, setIsUpdateRequired] = useState(false);
	const [isNewDataAvailable, setIsNewDataAvailable] = useState(false);

	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [mostrarPin, setMostrarPin] = useState(false);

	const { enqueueSnackbar } = useSnackbar();
	const { confirm } = useConfirm();

	const { data, refetch, isFetching, error } = useUsuarioLogadoQuery();

	const { mutateAsync: patchUsuarioMe } = useUsuarioMePatchMutation();

	const [currentTab, setCurrentTab] = useState(0);

	const {
		handleSubmit,
		formState: { errors, isDirty, disabled, isSubmitting },
		setError,
		setValue,
		reset,
		control
	} = useForm<UsuarioMeFormData>({
		defaultValues: {
			nomeCompleto: '',
			email: '',
			matricula: '',
			senha: '',
			confirmacaoSenha: '',
			pin: '',
			confirmacaoPin: '',
			createdAt: null,
			updatedAt: null,
		},
		resolver: zodResolver(UsuarioMeFormSchema),
		mode: 'onChange',
		disabled: isUpdating,
	});

	const handleServerErrors = useHandleServerErrors(setError, setIsUpdateRequired, setIsNewDataAvailable);

	const unblockNavigation = useBlockNavigation(isDirty);

	const onSubmit = async (data: UsuarioMeFormData) => {
		try {
			if (isEditMode)
				await patch(data)
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

	const patch = async (data: UsuarioMeFormData) => {
		const response = await patchUsuarioMe({
			payload: UsuarioMePatchRequestSchema.parse({
				...data,
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
			reset(UsuarioMeFormSchema.parse({
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
			case 1:
				return ['senha', 'confirmacaoSenha', 'pin', 'confirmacaoPin'].some(r => keys.includes(r));
				break;
		}
		return false;
	}, [errors]);

	const formFabs = useFormFabs(1, isEditMode, isNewDataAvailable, isUpdateRequired, update, isUpdating, handleSubmit, onSubmit, onError, isDirty, isSubmitting, handleDiscardChanges);

	const { data: perfis, refetch: refetchPerfis, isFetching: isPerfisFetching } = usePerfisByUsuarioIdAndEmpresaIdQuery(usuario?.usuarioId, empresaId);

	const { data: dispositivos, refetch: refetchDispositivos, isFetching: isDispositivosFetching } = useDispositivosByUsuarioIdQuery(usuario?.usuarioId);
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

	return <DashboardContent
		titulo={'Meu Usuário'}
		fabs={[
			<CustomFab tooltip={{ title: 'Voltar' }} key={0} onClick={() => browserHistory.back()} ><ArrowBack /></CustomFab>,
			...formFabs
		]}
	>
		{(!usuario && isFetching) ? <Carregando /> :
			(!usuario && error) ? <Alert severity='error'> Falha ao carregar </Alert> :
				<DashboardContentTabs
					tabs={[
						<DashboardContentTab icon={<Description />} label="Informações Básicas" key={0} />,
						<DashboardContentTab error={hasTabError(1)} icon={<Key />} label="Senhas" key={0} />,
						<DashboardContentTab icon={<Badge />} label="Perfis" key={1} />,
						<DashboardContentTab icon={<Devices />} label="Dispositivos Conectados" key={2} />,
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
										slotProps={{
											input: {
												readOnly: true
											}
										}}
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
										slotProps={{
											input: {
												readOnly: true
											}
										}}
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
										slotProps={{
											input: {
												readOnly: true
											}
										}}
										fullWidth
										variant='filled'
										label="Matrícula"
										error={!!(fieldState?.error)}
										helperText={fieldState?.error?.message}
									/>
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
								</ListItemButton >)}
							</List>
						</Stack>
					</Grid>
					<Grid container spacing={1}>
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
					</Grid>
				</DashboardContentTabs>}
		{errors?.root && <Alert severity='error'>{errors.root?.message}</Alert>}
	</DashboardContent>
}

export default UsuarioMeFormPage;