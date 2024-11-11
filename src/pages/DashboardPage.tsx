import { Backdrop, CircularProgress, Fade, Stack } from "@mui/material";
import { useEffect } from "react";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import CustomBottomNavigation from "../components/BottomNavigation/CustomBottomNavigation";
import DashboardContent from "../components/Dashboard/DashboardContent";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import useEmpresaIdParam from "../hooks/params/useEmpresaIdParam";
import { useEmpresaQuery } from "../queries/useEmpresaQueries";
import useAppStore from "../state/useAppStore";
import useAuthStore from "../state/useAuthStore";

const DashBoardPage = () => {

	const isAuth = useAuthStore(s => s.isAuth);
	const logout = useAuthStore(s => s.logout);

	const setEmpresa = useAppStore(s => s.setEmpresa);
	const isMobile = useAppStore(s => s.isMobile);
	const setDrawerOpen = useAppStore(s => s.setDrawerOpen);

	const empresaId = useEmpresaIdParam();
	const {data: empresa, isLoading: isEmpresaLoading, error: empresaError} = useEmpresaQuery(empresaId);

	useEffect(() => {
		if (isAuth !== undefined && !isAuth)
			logout(true);
	}, [isAuth]);

	useEffect(() => {
		setEmpresa(empresa);
	}, [empresa])

	useEffect(() => {
		if (isMobile)
			setDrawerOpen(false);
		else
			setDrawerOpen(true);
	}, [isMobile])

	if (!isAuth)
		return <Backdrop open>
			<CircularProgress color="inherit"></CircularProgress>
		</Backdrop>

	return <Fade in timeout={500}>
		<Stack height={"100dvh"}>
			<CustomAppBar/>
			<Stack direction="row" flexGrow={1} justifyContent="space-between">
				<CustomDrawer/>
				<DashboardContent/>
			</Stack>
			{isMobile && <CustomBottomNavigation/>}
		</Stack>
	</Fade>
}

export default DashBoardPage;