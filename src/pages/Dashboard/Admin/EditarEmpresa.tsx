import { useParams } from "react-router-dom";
import DashboardContent from "../../../components/Dashboard/DashboardContent";
import browserHistory from "../../../utils/browserHistory";
import { Button, Fab } from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";

const EditarEmpresa = () => {

	const {empresaId} = useParams();

	return <DashboardContent
		titulo={ empresaId == 'add' ? 'Nova Empresa' : 'Editar Empresa'}
		fabs={[
			<Fab onClick={() => {}}><Save/></Fab>,
			<Fab onClick={() => browserHistory.push('/admin/empresas')} ><ArrowBack/></Fab>,
		]}
	>
	</DashboardContent>
}

export default EditarEmpresa;