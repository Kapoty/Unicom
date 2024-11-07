import { ThemeProvider } from '@mui/material/styles';
import CustomRouter from './components/Router/CustomRouter';
import useMobileSync from './hooks/useMobileSync';
import useAppStore from './state/useAppStore';
import history from './utils/history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Typography } from '@mui/material';

const queryClient = new QueryClient();

const App = () => {
	
	useMobileSync();

	const isMobile = useAppStore(s => s.isMobile);
	const theme = useAppStore(s => s.theme);
	const setTheme = useAppStore(s => s.setTheme);

	return <QueryClientProvider client={queryClient}>
		<CustomRouter history={history}>
			<ThemeProvider theme={theme}>
				<Typography>{isMobile ? "Mobile" : "Desktop"}</Typography>
				<Button variant='contained' onClick={() => setTheme({corPrimaria: "#ff0000"})}>Hello</Button>
			</ThemeProvider>
		</CustomRouter>
	</QueryClientProvider>
	
}

export default App;