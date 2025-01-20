import { Chip, ChipProps, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import api from "../../shared/utils/api";
import { IAnexo } from "./Anexo";

export interface DispositivoChipProps extends ChipProps {
	anexo: IAnexo
}

const DispositivoChip = forwardRef<HTMLDivElement, DispositivoChipProps>(
	({ anexo, ...props }, ref) => {

		return <Tooltip title={anexo.thumbnailLink ? <img width="200px" src={anexo.thumbnailLink} /> : "Pré-visualização indisponível"} arrow>
			<Chip
				component="a"
				clickable
				target="_blank"
				label={anexo.name}
				href={`${api.defaults.baseURL}/anexos/${anexo.id}/download`}
				color="primary"
			/>
		</Tooltip>
	});

export default DispositivoChip;