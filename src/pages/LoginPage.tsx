import { zodResolver } from '@hookform/resolvers/zod';
import { AccountCircle, Key, Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from '@mui/lab';
import { Alert, Container, Grow, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from 'react-router-dom';
import { z } from "zod";
import EmpresaChip from '../domains/empresa/EmpresaChip';
import { useEmpresaByDominioQuery } from "../domains/empresa/EmpresaQueries";
import { login } from "../domains/auth/AuthService";
import useAuthStore from "../domains/auth/useAuthStore";
import { setTokens } from "../shared/utils/authUtil";
import useAppStore from '../shared/state/useAppStore';

const AuthFormSchema = z.object({
	login: z.string().min(1, {message: "Obrigatório"}).email("Email ou matrícula inválido").or(z.string().regex(/^\d+$/)),
	senha: z.string().min(1, {message: "Obrigatório"})
})

type AuthFormData = z.infer<typeof AuthFormSchema>;

const LoginPage = () => {

	const dominio = location.hostname;

	const { data: empresa, isLoading: isEmpresaLoading, error: empresaError } = useEmpresaByDominioQuery(dominio);

	const authLogin = useAuthStore(s => s.login);

	const setEmpresa = useAppStore(s => s.setEmpresa);

	const {enqueueSnackbar} = useSnackbar();

	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [growIn, setGrowIn] = useState(true);

	const [searchParams] = useSearchParams();
	const redirect = searchParams.get("redirect");

	const {
		register,
		handleSubmit,
		formState: {isSubmitting, errors, isValid},
		setError,
	  } = useForm<AuthFormData>({
		resolver: zodResolver(AuthFormSchema),
		mode: 'onChange',
	  });

	useEffect(() => {
		setEmpresa(empresa);
		if (empresa)
			loginRef?.current?.focus();
	}, [empresa]);

	const loginRef = useRef<HTMLInputElement>(null);

	const onSubmit = async (data: AuthFormData) => {
		try {
			const authTokens = await login({
				dominio: location.hostname,
				login: data.login,
				senha: data.senha,
			});

			//enqueueSnackbar('Bem vindo de volta!', {variant: 'success'});
			setGrowIn(false);

			setTimeout(() => {
				setTokens(authTokens.accessToken, authTokens.refreshToken);
				authLogin(redirect ?? "/");
			}, 250);
		} catch (error: any) {
			const errors = error?.response?.data?.errors;
			if (errors) {
				if (errors?.login)
					setError("login", {message: errors?.login})
				if (errors?.senha)
					setError("senha", {message: errors?.senha})
			} else {
				setError("root", {message: "Oops, algo inesperado aconteceu. Por favor, tente novamente."});
			}

			enqueueSnackbar('Falha ao se autenticar!', {variant: 'error'});
		}
	}

	return <>
		<Container>
			<Grow in={growIn} timeout={250}>
				<Stack padding={3} gap={3} useFlexGap justifyContent="center" alignItems="center" height="100dvh">

					<EmpresaChip
						empresa={empresa}
						isLoading={isEmpresaLoading}
						error={!!empresaError}
					/>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack useFlexGap gap={1} minWidth={300} width={400} maxWidth={(theme) => `calc(100dvw - ${theme.spacing(6)})`}>
							<TextField
								{...register('login')}
								required
								fullWidth
								label="Email ou Matrícula"
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position="start">
												<AccountCircle />
											</InputAdornment>
										),
									}
								}}
								variant="filled"
								error={!!(errors?.login)}
								helperText={errors?.login?.message}
								inputRef={loginRef}
							/>
							<TextField
								{...register('senha')}
								required
								type={mostrarSenha ? "text" : "password"}
								fullWidth
								label="Senha"
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
								variant="filled"
								error={!!(errors?.senha)}
								helperText={errors?.senha?.message}
							/>
							<LoadingButton
								loading={isSubmitting}
								loadingPosition='end'
								type="submit"
								variant="contained"
								size="large"
								endIcon={<Login />}
								disabled={!empresa}
							>
								Acessar
							</LoadingButton>
							{errors?.root && <Alert severity='error'>{errors.root.message}</Alert>}
						</Stack>
					</form>

					<Typography align="center" variant="caption">
						Copyright © 2024 UniSystem
					</Typography>

				</Stack>
			</Grow>
		</Container>
	</>;
}

export default LoginPage;