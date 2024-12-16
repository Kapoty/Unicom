import { Theme } from '@mui/material';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange } from '@mui/material/colors';
import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid-premium/locales';
import { deepmerge } from '@mui/utils';
import { PaletteColorOptions } from "@mui/material/styles";
import { AparenciaCor } from '../../domains/empresa/Empresa';

declare module '@mui/material/styles' {
	interface TypeBackground {
		light?: string
	}

	interface PaletteOptions {
		green?: PaletteColorOptions
	}
}

export interface ThemeProps {
	corPrimaria?: AparenciaCor
}

const colors = {
	'red': red,
	'pink': pink,
	'purple': purple,
	'deepPurple': deepPurple,
	'indigo': indigo,
	'blue': blue,
	'lightBlue': lightBlue,
	'cyan': cyan,
	'teal': teal,
	'green': green,
	'lightGreen': lightGreen,
	'lime': lime,
	'yellow': yellow,
	'amber': amber,
	'orange': orange,
	'deepOrange': deepOrange
}

const createCustomTheme = (props?: ThemeProps): Theme => {
	let theme = createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: colors?.[props?.corPrimaria ?? 'red']?.[800] ?? colors.red[800],
			},
			secondary: colors.red,
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
				default: "#0D0F12",//"#0f1214",
				paper: "#0D0F12",//"#0f1214",
				light: "#13181b",
			},
			green: colors.green
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: "#0D0F12", //"#111215",//
					},
					'.dirtyField': {
						paddingBottom: '5px !important',
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
			MuiFab: {
				defaultProps: {
					size: 'medium',
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
			MuiTextField: {
				defaultProps: {
					variant: 'filled',
				}
			},
			MuiSelect: {
				defaultProps: {
					//variant: 'outlined',
				}
			},
		}
	}));

	theme = responsiveFontSizes(theme);

	return theme;
}

export default createCustomTheme;