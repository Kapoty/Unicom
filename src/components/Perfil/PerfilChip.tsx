import { Error as ErrorIcon, MoreHoriz } from "@mui/icons-material";
import { Avatar, Box, Chip, ChipProps, ChipPropsColorOverrides, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { usePerfilQuery } from "../../queries/usePerfilQueries";
import { getFotoUrl } from "../../services/perfilService";
import { Perfil } from "../../ts/types/perfilTypes";
import { forwardRef, ReactNode } from "react";

export interface PerfilChipProps extends ChipProps {
	perfilId?: number,
	perfil?: Perfil,
	isLoading?: boolean,
	error?: boolean,
	avatarOnly: boolean
}

const PerfilChip = forwardRef<HTMLDivElement, PerfilChipProps>(
	({ perfilId, perfil, isLoading, error, avatarOnly, ...props }, ref) => {

	const { data, isLoading: isDataLoading, error: dataError } = usePerfilQuery(perfilId);

	const perfilData = perfil || data;
	const perfilLoading = isLoading || isDataLoading;
	const perfilError = (error || dataError) && !perfilLoading;

	let title, label, color: 'primary' | 'error' | 'default', avatarSrc, avatarIcon;

	if (perfilData) {
		title = perfilData.nome;
		label = title;
		color = 'primary';
		avatarSrc = perfilData?.foto ? getFotoUrl(perfilData.perfilId) : '';
		avatarIcon = perfilData.nome.charAt(0);
	} else if (perfilError) {
		title = 'Perfil não identificado!';
		label = title;
		color = 'error';
		avatarSrc = undefined;
		avatarIcon = <ErrorIcon />;
	} else {
		title = '...';
		label = title;
		color = 'default';
		avatarSrc = undefined;
		avatarIcon = <MoreHoriz />;
	}

	return <Tooltip arrow title={title}>
		<Box>
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