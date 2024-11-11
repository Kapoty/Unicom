import { Error as ErrorIcon, MoreHoriz } from "@mui/icons-material";
import { Avatar, Chip, ChipProps } from "@mui/material";
import { usePerfilQuery } from "../../queries/usePerfilQueries";
import { getFotoUrl } from "../../services/perfilService";
import { Perfil } from "../../ts/types/perfilTypes";
import { forwardRef } from "react";

export interface PerfilChipProps extends ChipProps {
	perfilId?: number,
	perfil?: Perfil,
	isLoading?: boolean,
	error?: boolean,
	hideNome: boolean
}

const PerfilChip = forwardRef<HTMLDivElement, PerfilChipProps>(
	({ perfilId, perfil, isLoading, error, hideNome, ...props }, ref) => {

	const { data, isLoading: isDataLoading, error: dataError } = usePerfilQuery(perfilId);

	const perfilData = perfil || data;
	const perfilLoading = isLoading || isDataLoading;
	const perfilError = error || dataError;

	if (perfilData)
		return <Chip
			color="primary"
			avatar={
				<Avatar
					src={perfilData?.foto ? getFotoUrl(perfilData.perfilId) : ''}
				>
					{perfilData.nome.charAt(0)}
				</Avatar>
			}
			label={!hideNome ? perfilData.nome : ""}
			ref={ref}
			{...props}
		/>

	if (perfilError && !perfilLoading)
		return <Chip color="error" avatar={<Avatar><ErrorIcon /></Avatar>} label="Perfil não identificado!" ref={ref} {...props}/>

	return <Chip avatar={<Avatar><MoreHoriz /></Avatar>} label="..." ref={ref} {...props}/>
});

export default PerfilChip;