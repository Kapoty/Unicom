import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LicenseInfo } from '@mui/x-license';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import "./assets/css/styles.css";
import AppRouter from './components/Router/AppRouter';
import CustomRouter from './components/Router/CustomRouter';
import CustomSnackbarProvider from './components/Snackbar/CustomSnackbarProvider';
import useAuthSync from './hooks/sync/useAuthSync';
import useEmpresaSync from './hooks/sync/useEmpresaSync';
import useMobileSync from './hooks/sync/useMobileSync';
import useAppStore from './state/useAppStore';
import browserHistory from './utils/browserHistory';

dayjs.locale('pt')
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime);

LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

export const queryClient = new QueryClient();

const App = () => {
	
	useMobileSync();
	useAuthSync();
	useEmpresaSync();

	const theme = useAppStore(s => s.theme);

	return (
		<QueryClientProvider client={queryClient}>
			{<ReactQueryDevtools/>}
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
					<CustomSnackbarProvider>
						<CssBaseline />
						<CustomRouter history={browserHistory}>
							<AppRouter/>
						</CustomRouter>
					</CustomSnackbarProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
	
}

export default App;