import { Color, PaletteColorOptions, Theme } from '@mui/material';
import { red, green, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid-premium/locales';

declare module '@mui/material/styles' {
	interface TypeBackground {
		light?: string
	}

	interface PaletteOptions {
		green?: PaletteColorOptions
	}
}

export interface ThemeProps {
	corPrimaria?: string
}

const createCustomTheme = (props?: ThemeProps): Theme => createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: props?.corPrimaria ?? "#455a64"
			},
			secondary: red,
			success: {
				main: "#388e3c"
			},
			error: {
				main: "#d32f2f"
			},
			info: {
				main: "#303f9f"
			},
			warning: {
				main: "#fbc02d"
			},
			background: {
				default: "#0f1214",
				paper: "#0f1214",
				light: "#13181b",
			},
			green: green
		},
		components: {
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						fontFamily: "Roboto",
					}
				},
			},
			MuiDialog: {
				defaultProps: {
					PaperProps: {
						elevation: 0,
						variant: "outlined",
					}
				}
			},
			MuiAlert: {
				defaultProps: {
					variant: "standard",
				}
			},
		},
	},
	ptBR,
)

export default createCustomTheme;