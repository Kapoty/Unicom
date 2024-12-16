import { Fade, Stack } from "@mui/material";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useEmpresaQuery } from "../domains/empresa/EmpresaQueries";
import RelatoriosPage from "../domains/relatorio/RelatoriosPage";
import CustomAppBar from "../shared/components/AppBar/CustomAppBar";
import CustomBottomNavigation from "../shared/components/BottomNavigation/CustomBottomNavigation";
import CustomDrawer from "../shared/components/Drawer/CustomDrawer";
import Carregando from "../shared/components/Feedback/Carregando";
import useEmpresaIdParam from "../shared/hooks/useEmpresaIdParam";
import useAppStore from "../shared/state/useAppStore";

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
				<Stack p={1} flexGrow={1} overflow='hidden'>
					<Suspense fallback={<Carregando />}>
						<Outlet/>
					</Suspense>
					<RelatoriosPage/>
				</Stack>
			</Stack>
			{isMobile && false && <CustomBottomNavigation/>}
		</Stack>
	</Fade>
}

export default DashBoardPage;