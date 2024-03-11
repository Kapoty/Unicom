import React, { Suspense } from "react";
import { createRoot } from 'react-dom/client';

import 'assets/css/general.css';

const LoginRoute = React.lazy(() => import('routes/LoginRoute'));
const PainelRoute = React.lazy(() => import('routes/PainelRoute'));

import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter} from "react-router-dom";

import history from "utils/history";

const theme = createTheme({
	palette: {
			mode: "dark",
			primary: grey,
			background: {
				 default: "#000000",
				 paper: "#000000",
			 },
	 },
	},
	ptBR,
);

class SiteRouter extends React.Component {

	 render() {
	return <HistoryRouter history={history}>
				<ThemeProvider theme={theme}>
					<div id="app">
						<Suspense fallback={<Backdrop sx={{color: "primary.main"}} open={true}>
												<CircularProgress color="inherit"/>
											</Backdrop>}>
							<Routes>
								 <Route path="/login" element={<LoginRoute/>} />
								 <Route path="/*" element={<PainelRoute/>} />
							</Routes>
						</Suspense>
					</div>
			 	</ThemeProvider>
			</HistoryRouter>
	 }
}

const root = createRoot( document.getElementById("root"));

root.render(<SiteRouter/>,);