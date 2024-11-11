import { Theme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid-premium/locales';
import { deepmerge } from '@mui/utils';
import { PaletteColorOptions } from "@mui/material/styles";

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

const createCustomTheme = (props?: ThemeProps): Theme => {
	let theme = createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: props?.corPrimaria ?? "#c62828"//"#455a64"
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
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: "#111215",
					}
				}
			},
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 28,
					}
				}
			},
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
	}, ptBR);

	console.log(theme?.components?.MuiSelect?.defaultProps);

	theme = createTheme(deepmerge(theme, {
		components: {
			MuiIcon: {
				defaultProps: {
					size: "large"
				}
			},
			MuiTooltip: {
				defaultProps: {
					disableInteractive: true,
				},
				styleOverrides: {
					/*arrow: {
						color: theme.palette.primary.main,
					},
					tooltip: {
						backgroundColor: theme.palette.common.black,
						border: `1px solid ${theme.palette.primary.main}`,
						fontSize: '12pt',
					}*/
					arrow: {
						color: theme.palette.common.white,
					},
					tooltip: {
						backgroundColor: theme.palette.common.white,
						//border: `1px solid ${theme.palette.primary.main}`,
						fontSize: '12pt',
						color: theme.palette.common.black,
					}
				}
			},
			MuiMenu: {
				styleOverrides: {
					list: {
						padding: theme.spacing(1),
					},
					paper: {
						borderRadius: 14,
					},
				}
			},
			MuiMenuItem: {
				defaultProps: {
					//dense: true,
				},
				styleOverrides: {
					root: {
						borderRadius: 28,
					}
				}
			},
			MuiPopover: {
				defaultProps: {
					slotProps: {
						paper: {
							variant: "outlined",
						}
					}
				},
			}
		}
	}));

	console.log(theme?.components?.MuiSelect?.defaultProps);


	return theme;
}

export default createCustomTheme;