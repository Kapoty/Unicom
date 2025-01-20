import { Box, Chip, ChipProps, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import { IDispositivo } from "./Dispositivo";
import { formatDateTime } from "../../shared/utils/dateUtils";

export interface DispositivoChipProps extends ChipProps {
	dispositivo: IDispositivo
}

const DispositivoChip = forwardRef<HTMLDivElement, DispositivoChipProps>(
	({ dispositivo, ...props }, ref) => {

	return <Tooltip arrow title={<>
		<Box>IP: {dispositivo.ip}</Box>
		<Box>Acesso: {formatDateTime(dispositivo.dataCriacao)}</Box>
		<Box>Válido até: {formatDateTime(dispositivo.dataExpiracao)}</Box>
		</>}>
		<Box>
			<Chip
				color='default'
				//avatar={<Avatar src={avatarSrc}>{avatarIcon}</Avatar>}
				label={`${dispositivo.sistemaOperacional}/${dispositivo.navegador}`}
				ref={ref}
				{...props}
			/>
		</Box>
	</Tooltip>
});

export default DispositivoChip;