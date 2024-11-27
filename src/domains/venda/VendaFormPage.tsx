import { useParams } from "react-router-dom";
import DashboardContent from "../../shared/components/Dashboard/DashboardContent";
import browserHistory from "../../shared/utils/browserHistory";
import { Button } from "@mui/material";

const VendaFormPage = () => {

	const {vendaId} = useParams();

	return <DashboardContent
		titulo={vendaId == 'add' ? 'Nova Venda' : 'Editar Venda'}
	>
		<Button onClick={() => browserHistory.push(`${parseInt(vendaId!) + 1}`)}>Próxima</Button>
	</DashboardContent>
}

export default VendaFormPage;