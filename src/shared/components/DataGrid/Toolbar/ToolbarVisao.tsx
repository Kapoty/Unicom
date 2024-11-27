import { Preview } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import ToolbarVisaoPanel from "../Panel/Visao/ToolbarVisaoPanel";

const ToolbarVisao = () => {

	const [visaoPanelOpen, setVisaoPanelOpen] = useState(false);

	return <>
		<Tooltip arrow title={"Visão"}>
			<Box>
				<IconButton size="small" onClick={() => setVisaoPanelOpen(true)}>
					<Preview />
				</IconButton>
			</Box>
		</Tooltip>

		{visaoPanelOpen && <ToolbarVisaoPanel onClose={() => setVisaoPanelOpen(false)}/>}
	</>
}

export default ToolbarVisao;