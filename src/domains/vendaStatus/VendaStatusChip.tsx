import { Chip, Avatar, Skeleton, Icon } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { IVendaStatus } from "./VendaStatus";
import { useVendaStatusByEmpresaIdAndVendaStatusIdQuery } from "./VendaStatusQueries";

export interface VendaStatusChipProps {
	empresaId?: number,
	vendaStatusId?: number,
	vendaStatus?: IVendaStatus,
	isLoading?: boolean,
	error?: boolean,
	onClick?: (() => void),
}

const VendaStatusChip = ({ empresaId, vendaStatusId, vendaStatus, isLoading, error, onClick }: VendaStatusChipProps) => {

	const { data, isLoading: isDataLoading, error: dataError } = useVendaStatusByEmpresaIdAndVendaStatusIdQuery(empresaId, vendaStatusId);

	const vendaStatusData = vendaStatus || data;
	const vendaStatusLoading = isLoading || isDataLoading;
	const vendaStatusError = (error || dataError) && !vendaStatusLoading;

	if (vendaStatusData)
		return <Chip
			onClick={onClick}
			color="primary"
			style={{backgroundColor: vendaStatusData.cor, color: '#fff', fontWeight: "bold"}}
			label={vendaStatusData.nome}
			icon={<Icon>{vendaStatusData.icone}</Icon>}
			sx={{
				overflow: "hidden"
			}}
		/>
	
	if (vendaStatusError)
		return <Chip color="error" avatar={<Avatar><ErrorIcon color="error" /></Avatar>} label="?" />
	
	return <Chip avatar={<Avatar><Skeleton variant="circular"/></Avatar>} label={<Skeleton variant="text" width={50}/>} />
}

export default VendaStatusChip;