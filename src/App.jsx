import React, { Suspense } from "react";
import { createRoot } from 'react-dom/client';

import 'assets/css/general.css';

const LoginRoute = React.lazy(() => import('routes/LoginRoute'));
const PainelRoute = React.lazy(() => import('routes/PainelRoute'));
const JornadaRoute = React.lazy(() => import('routes/JornadaRoute'));
const PontoFacialRoute = React.lazy(() => import('routes/PontoFacialRoute'));

import { red, green, grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid-premium/locales';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from "react-router-dom";

import history from "utils/history";

import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import 'dayjs/locale/pt';

import dayjs from 'dayjs';
dayjs.locale('pt')

var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

const SiteRouter = React.memo(({themePrimaryColor, updateThemePrimaryColor}) => {

	const theme = React.useMemo(() =>
		createTheme({
			palette: {
					mode: "dark",
					primary: {
						main: themePrimaryColor//"#1976d2"//"#00c853"
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
						main: "#fbc02d"//"#e64a19"
					},
					background: {
						default: "#0f1214",//"#0a0b0c",
						paper: "#0f1214",
						light: "#13181b",
					 },
					green: green,
					grey: {
						light: grey[300],
						main: grey[500],
						dark: grey[700],
						contrastText: "#111",
					},
			},
			/*mixins: {
				MuiDataGrid: {
				// Pinned columns sections
				pinnedBackground: '#000',
				// Headers, and top & bottom fixed rows
				containerBackground: '#000',
				},
			},*/
			components: {
				/*MuiButtonBase: {
					defaultProps: {
						disableRipple: true,
					},
				},*/
				MuiAccordionSummary: {
					styleOverrides: {
						root: {
							fontFamily: "Roboto",
						}
					},
				},
				MuiPaper: {
					defaultProps: {
						//elevation: 0,
						//variant: "outlined",
					}
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
			/*transitions: {
				// So we have `transition: none;` everywhere
				create: () => 'none',
			},*/
			},
			ptBR,	
		)
	, [themePrimaryColor]);

	console.log("SiteRouter was rendered at", new Date().toLocaleTimeString());

	return <HistoryRouter history={history}>
					<ThemeProvider theme={theme}>
						<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
							<div id="app">
								<Suspense fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
														<CircularProgress color="inherit"/>
													</Backdrop>}>
									<Routes>
										 <Route path="/login" element={<LoginRoute updateThemePrimaryColor={updateThemePrimaryColor}/>} />
										 {/*<Route path="/ponto-facial" element={<PontoFacialRoute/>} />*/}
										 <Route path="/jornada" element={<JornadaRoute updateThemePrimaryColor={updateThemePrimaryColor}/>} />
										 <Route path="/*" element={<PainelRoute updateThemePrimaryColor={updateThemePrimaryColor}/>} />
									</Routes>
								</Suspense>
							</div>
						</LocalizationProvider>
				 	</ThemeProvider>
				</HistoryRouter>

});

class App extends React.Component {

	constructor(props) {
		super(props);

		this.defaultThemePrimaryColor = "#455a64";

		this.state = {
			themePrimaryColor: this.defaultThemePrimaryColor
		};

		this.updateThemePrimaryColor = this.updateThemePrimaryColor.bind(this);
	}

	updateThemePrimaryColor(themePrimaryColor) {
		this.setState({themePrimaryColor: themePrimaryColor !== "" ? themePrimaryColor : this.defaultThemePrimaryColor});
	}

	render() {
		console.log("App was rendered at", new Date().toLocaleTimeString());

		return <SiteRouter themePrimaryColor={this.state.themePrimaryColor} updateThemePrimaryColor={this.updateThemePrimaryColor} />
	}
}

const root = createRoot(document.getElementById("root"));

root.render(<App/>,);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js')
		.then(registration => {
			console.log('SW registered: ', registration);
		}).catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}