import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import CustomRouter from './components/Router/CustomRouter';
import useAuthSync from './hooks/useAuthSync';
import useMobileSync from './hooks/useMobileSync';
import DashBoardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import useAppStore from './state/useAppStore';
import history from './utils/history';
import { CssBaseline } from '@mui/material';
import "./assets/css/styles.css";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime'
import { LicenseInfo } from '@mui/x-license';

dayjs.locale('pt')
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime);

LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

const queryClient = new QueryClient();

const App = () => {
	
	useMobileSync();
	useAuthSync();

	const theme = useAppStore(s => s.theme);

	return <QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<CustomRouter history={history}>
				<Routes>
					<Route path="/login" element={<LoginPage/>}></Route>
					<Route path="/*" element={<DashBoardPage/>}></Route>
				</Routes>
			</CustomRouter>
		</ThemeProvider>
	</QueryClientProvider>
	
}

export default App;