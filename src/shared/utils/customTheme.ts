import { Theme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';
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
				},
				styleOverrides: {
					paper: {
						borderRadius: '14px',
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

	theme = createTheme(deepmerge(theme, {
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 28,
					}
				}
			},
			MuiIcon: {
				defaultProps: {
					//size: "large"
				}
			},
			MuiTooltip: {
				defaultProps: {
					arrow: true,
					disableInteractive: true,
				},
				styleOverrides: {
					arrow: {
						color: theme.palette.common.white,
					},
					tooltip: {
						backgroundColor: theme.palette.common.white,
						fontSize: '12pt',
						color: theme.palette.common.black,
					}
				}
			},
			MuiMenu: {
				styleOverrides: {
					list: {
						//padding: theme.spacing(1),
					},
					paper: {
						//borderRadius: 14,
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
			MuiListItemButton: {
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
							elevation: 0,
							sx: {
								padding: theme.spacing(1),
								borderRadius: '14px',
							}
						}
					}
				},
				styleOverrides: {
					root: {
						'& .MuiBackdrop-root': {
							backgroundColor: 'rgba(0, 0, 0, 0.25)'
						},
					},
				}
			},
			MuiPaper: {
				defaultProps: {
					//variant: "outlined",
					//elevation: 0,
				},
				styleOverrides: {
					root: {
						//borderRadius: 14,
						//padding: theme.spacing(1)
					}
				}
			},
			MuiList: {
				defaultProps: {
					disablePadding: true
				}
			},
		}
	}));

	theme = responsiveFontSizes(theme);

	return theme;
}

export default createCustomTheme;