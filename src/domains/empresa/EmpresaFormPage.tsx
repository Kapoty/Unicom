import { useParams } from "react-router-dom";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import browserHistory from "../../shared/utils/browserHistory";
import { Box, Button, Fab, Tab } from "@mui/material";
import { ArrowBack, Description, Domain, Gavel, Palette, Save } from "@mui/icons-material";
import { useEmpresaAdminQuery } from "./EmpresaQueries";
import { z } from "zod";
import { useCallback, useRef, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ToolbarVisaoList from "../../shared/components/DataGrid/Panel/Visao/ToolbarVisaoList";
import useAppStore from "../../shared/state/useAppStore";

const EmpresaFormSchema = z.object({

});

const EmpresaForm = () => {

	const { empresaId } = useParams();
	const isEditMode = useRef(empresaId !== 'add').current;

	const {data: empresa} = useEmpresaAdminQuery(isEditMode ? parseInt(empresaId!) : undefined);

	const [currentTab, setCurrentTab] = useState("");
	const handleTabChange = useCallback((event: React.SyntheticEvent, value: any) => setCurrentTab(value), []);

	const isMobile = useAppStore(s => s.isMobile);

	return <DashboardContent
		titulo={ isEditMode ? 'Editar Empresa' : 'Nova Empresa'}
		fabs={[
			<Fab onClick={() => {}}><Save/></Fab>,
			<Fab onClick={() => browserHistory.push('/admin/empresas')} ><ArrowBack/></Fab>,
		]}
	>
		<TabContext value={currentTab}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<TabList onChange={handleTabChange} scrollButtons allowScrollButtonsMobile variant="scrollable">
					<Tab icon={<Description/>} label="Informações Básicas" value="" sx={{width: 200}}/>
					<Tab icon={<Gavel/>} label="Contratos" value="contratos" />
					<Tab icon={<Domain/>} label="Domínios" value="dominios" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia2" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia3" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia4" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia5" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia6" />
					<Tab icon={<Palette/>} label="Aparência" value="aparencia7" />
				</TabList>
			</Box>
			<TabPanel value="">
				{JSON.stringify(empresa)}
			</TabPanel>
		</TabContext>
	</DashboardContent>
}
 
export default EmpresaForm;