import React, { Suspense } from "react";
import { createRoot } from 'react-dom/client';

import 'assets/css/general.css';

const LoginRoute = React.lazy(() => import('routes/LoginRoute'));
const PainelRoute = React.lazy(() => import('routes/PainelRoute'));
const PontoFacialRoute = React.lazy(() => import('routes/PontoFacialRoute'));

import { red, green, grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from "react-router-dom";

import history from "utils/history";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pt';

import dayjs from 'dayjs';
dayjs.locale('pt')

var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

const theme = createTheme({
	palette: {
			mode: "dark",
			primary: {
				main: "#00c853"
			},
			secondary: red,
			background: {
				 default: "#000000",
				 paper: "#000000",
			 },
			green: green,
			grey: {
				light: grey[300],
				main: grey[500],
				dark: grey[700],
				contrastText: "#111",
			}
	 },
	},
	ptBR,
);

class SiteRouter extends React.Component {

	render() {
	return <HistoryRouter history={history}>
				<ThemeProvider theme={theme}>
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
						<div id="app">
							<Suspense fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
													<CircularProgress color="inherit"/>
												</Backdrop>}>
								<Routes>
									 <Route path="/login" element={<LoginRoute/>} />
									 {/*<Route path="/ponto-facial" element={<PontoFacialRoute/>} />*/}
									 <Route path="/*" element={<PainelRoute/>} />
								</Routes>
							</Suspense>
						</div>
					</LocalizationProvider>
			 	</ThemeProvider>
			</HistoryRouter>
	 }
}

const root = createRoot( document.getElementById("root"));

root.render(<SiteRouter/>,);

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