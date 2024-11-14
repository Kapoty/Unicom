import { Chip, Avatar, Badge } from "@mui/material";
import { getArquivoUrl } from "../../services/empresaService";
import { MoreHoriz, Error as ErrorIcon } from "@mui/icons-material";
import { useEmpresaQuery } from "../../queries/useEmpresaQueries";
import { ReactNode } from "react";
import { IEmpresaPublic } from "../../models/Empresa";

export interface EmpresaChipProps {
	empresaId?: number,
	empresa?: IEmpresaPublic,
	isLoading?: boolean,
	error?: boolean,
}

const EmpresaChip = ({ empresaId, empresa, isLoading, error }: EmpresaChipProps) => {

	const { data, isLoading: isDataLoading, error: dataError } = useEmpresaQuery(empresaId);

	const empresaData = empresa || data;
	const empresaLoading = isLoading || isDataLoading;
	const empresaError = (error || dataError) && !empresaLoading;

	if (empresaData)
		return <Chip
			avatar={
				<Avatar
					src={empresaData?.aparencia?.icone ? getArquivoUrl(empresaData.empresaId, empresaData.aparencia.icone) : ''}
				>
					{empresaData.nome.charAt(0)}
				</Avatar>
			}
			label={empresaData.nome}
		/>
	
	if (empresaError)
		return <Chip color="error" avatar={<Avatar><ErrorIcon /></Avatar>} label="Empresa não identificada!" />
	
	return <Chip avatar={<Avatar><MoreHoriz /></Avatar>} label="..." />
}

export default EmpresaChip;