import { Fade, Stack } from "@mui/material";
import { useEffect } from "react";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import CustomBottomNavigation from "../components/BottomNavigation/CustomBottomNavigation";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import CustomBackdrop from "../components/Backdrop/CustomBackdrop";
import useEmpresaIdParam from "../hooks/params/useEmpresaIdParam";
import { useEmpresaQuery } from "../queries/useEmpresaQueries";
import useAppStore from "../state/useAppStore";
import useAuthStore from "../state/useAuthStore";
import { Outlet } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";

const DashBoardPage = () => {

	const setEmpresa = useAppStore(s => s.setEmpresa);
	const isMobile = useAppStore(s => s.isMobile);
	const setDrawerOpen = useAppStore(s => s.setDrawerOpen);

	const empresaId = useEmpresaIdParam();
	const {data: empresa} = useEmpresaQuery(empresaId);

	useEffect(() => {
		setEmpresa(empresa);
	}, [empresa]);

	useEffect(() => {
		if (isMobile)
			setDrawerOpen(false);
		else
			setDrawerOpen(true);
	}, [isMobile]);

	return <Fade in timeout={500}>
		<Stack height={"100dvh"}>
			<CustomAppBar/>
			<Stack direction="row" flexGrow={1} justifyContent="space-between">
				<CustomDrawer/>
				<Stack p={1} flexGrow={1} overflow='hidden' sx={{ position: 'relative' }}>
					<Outlet/>
				</Stack>
			</Stack>
			{isMobile && <CustomBottomNavigation/>}
		</Stack>
	</Fade>
}

export default DashBoardPage;