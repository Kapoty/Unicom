import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { DataGridContext } from "../DataGridContext";

const ToolbarFullscreen = () => {

	const { fullscreen, toggleFullscreen } = useContext(DataGridContext)!;

	return <Tooltip title={fullscreen ? "Reduzir" : "Maximizar"}>
		<Box>
			<IconButton size="small" color={fullscreen ? "primary" : 'default'} onClick={toggleFullscreen}>
				{fullscreen ? <FullscreenExit /> : <Fullscreen />}
			</IconButton>
		</Box>
	</Tooltip>
}

export default ToolbarFullscreen;