import { Theme } from "@mui/material/styles";
import { ThemeProps } from "../../utils/customTheme";
import { Empresa, EmpresaPublic } from "./empresaTypes";
import { UsuarioMe } from "./usuarioTypes";
import { Perfil } from "./perfilTypes";

export interface AppState {
    isMobile: boolean;
    setMobile: (isMobile: boolean) => void;
    theme: Theme;
    setTheme: (props?: ThemeProps) => void;
    empresa?: EmpresaPublic,
    setEmpresa: (empresa?: EmpresaPublic) => void;
    drawerOpen: boolean;
    setDrawerOpen: (drawerOpen: boolean) => void;
	fullscreen: boolean;
    setFullscreen: (fullscreen: boolean) => void;
}