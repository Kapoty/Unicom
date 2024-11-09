import { Theme } from "@mui/material/styles";
import { ThemeProps } from "../../utils/theme";

export interface AppState {
    isMobile: boolean;
    setMobile: (isMobile: boolean) => void;
    theme: Theme;
    setTheme: (props?: ThemeProps) => void;
}