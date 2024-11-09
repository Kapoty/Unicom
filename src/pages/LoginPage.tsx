import { AccountCircle, Key, Lock, Login, Visibility, VisibilityOff, Error, Pending } from "@mui/icons-material";
import { Avatar, Backdrop, Button, Chip, CircularProgress, Container, Grow, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useEmpresaByDominioQuery } from "../queries/useEmpresaQuery";
import { getArquivoUrl } from "../services/empresaService";
import useAuthStore from "../state/useAuthStore";
import history from "../utils/history";
import useAppStore from "../state/useAppStore";

const LoginPage = () => {

    const dominio = location.hostname;
    const { data: empresa, isLoading, error } = useEmpresaByDominioQuery(dominio);
    const isAuth = useAuthStore(s => s.isAuth);
    const setTheme = useAppStore(s => s.setTheme);

    useEffect(() => {
        if (isAuth !== undefined && isAuth)
            history.push("/");
    }, [isAuth]);

    useEffect(() => {
        if (empresa?.aparencia?.cor)
            setTheme({ corPrimaria: empresa.aparencia.cor! });
        else
            setTheme();
    }, [empresa]);

    if (isAuth == undefined)
        return <Backdrop open>
            <CircularProgress color="inherit"></CircularProgress>
        </Backdrop>

    return <>
        <Container>
            <Grow in>
                <Stack padding={3} gap={3} useFlexGap justifyContent="center" alignItems="center" minHeight="100vh">
                    {/*<Avatar sx={{bgcolor: "palette.primary"}}>
                        <Lock/>
                    </Avatar>*/}
                    {isLoading && <Chip avatar={<Avatar><Pending /></Avatar>} label="..." />}
                    {error && <Chip color="error" avatar={<Avatar><Error /></Avatar>} label="Empresa não identificada!" />}
                    {empresa && <Chip avatar={<Avatar src={empresa?.aparencia?.icone ? getArquivoUrl(empresa.empresaId!, empresa.aparencia.icone!) : ""}>{empresa.nome.charAt(0)}</Avatar>} label={empresa.nome} />}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Stack useFlexGap gap={1} maxWidth={400}>
                            <TextField
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
                                disabled={!empresa}
                            />
                            <TextField
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
                                                    edge="end"
                                                >
                                                    {true ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        autoComplete: 'new-password'
                                    }
                                }}
                                variant="filled"
                                disabled={!empresa}
                            />
                            <Button type="submit" variant="contained" size="large" endIcon={<Login />} disabled={!empresa}>Acessar</Button>
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