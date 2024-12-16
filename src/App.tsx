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
import AppRouter from './shared/components/Router/AppRouter';
import CustomRouter from './shared/components/Router/CustomRouter';
import CustomSnackbarProvider from './shared/components/Snackbar/CustomSnackbarProvider';
import useAuthSync from './domains/auth/useAuthSync';
import useEmpresaSync from './shared/hooks/useEmpresaSync';
import useMobileSync from './shared/hooks/useMobileSync';
import browserHistory from './shared/utils/browserHistory';
import queryClient from './shared/utils/queryClient';
import useOnlineSync from './shared/hooks/useOnlineSync';
import useAppStore from './shared/state/useAppStore';
import { ConfirmProvider } from './shared/components/ConfirmDialog/ConfirmProvider';

dayjs.locale('pt')
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime);

LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

const App = () => {
	
	useMobileSync();
	useAuthSync();
	useEmpresaSync();
	useOnlineSync();

	const theme = useAppStore(s => s.theme);

	return (
		<QueryClientProvider client={queryClient}>
			{false && <ReactQueryDevtools/>}
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
					<CustomSnackbarProvider>
						<ConfirmProvider>
							<CssBaseline />
							<CustomRouter history={browserHistory}>
								<AppRouter/>
							</CustomRouter>
						</ConfirmProvider>
					</CustomSnackbarProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
	
}

export default App;