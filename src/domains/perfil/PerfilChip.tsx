import { Error as ErrorIcon, MoreHoriz } from "@mui/icons-material";
import { Avatar, Box, Chip, ChipProps, ChipPropsColorOverrides, CircularProgress, IconButton, Skeleton, Tooltip } from "@mui/material";
import { usePerfilQuery } from "./PerfilQueries";
import { IPerfil } from "./Perfil";
import { forwardRef, ReactNode } from "react";
import { getArquivoUrl } from "./PerfilService";

export interface PerfilChipProps extends ChipProps {
	perfilId?: number,
	perfil?: IPerfil,
	isLoading?: boolean,
	error?: boolean,
	avatarOnly?: boolean
}

const PerfilChip = forwardRef<HTMLDivElement, PerfilChipProps>(
	({ perfilId, perfil, isLoading, error, avatarOnly, ...props }, ref) => {

	const { data, isLoading: isDataLoading, error: dataError } = usePerfilQuery(perfilId);

	const perfilData = perfil || data;
	const perfilLoading = isLoading || isDataLoading;
	const perfilError = (error || dataError) && !perfilLoading;

	let title, label, color: 'primary' | 'error' | 'default', avatarSrc, avatarIcon;

	if (perfilData) {
		title = `${perfilData.nome}`;
		label = title;
		color = 'primary';
		avatarSrc = perfilData?.foto ? getArquivoUrl(perfilData.perfilId, perfilData.foto) : '';
		avatarIcon = perfilData.nome.charAt(0);
	} else if (perfilError) {
		title = 'Perfil não identificado!';
		label = title;
		color = 'error';
		avatarSrc = undefined;
		avatarIcon = <ErrorIcon color="error" />;
	} else {
		title = <Skeleton variant="text" width={50}/>;
		label = title;
		color = 'default';
		avatarSrc = undefined;
		avatarIcon = <Skeleton variant="circular"/>;
	}

	return <Tooltip arrow title={title}>
		<Box width='fit-content'>
			<Chip
				color={color}
				avatar={<Avatar src={avatarSrc}>{avatarIcon}</Avatar>}
				sx={{
					'& .MuiAvatar-root': {
						...(avatarOnly ? {mr: '6px'} : {})
					},
					'& .MuiChip-label': {
						...(avatarOnly ? {display: 'none'} : {})
					}
				}}
				label={label}
				ref={ref}
				{...props}
			/>
		</Box>
	</Tooltip>
});

export default PerfilChip;