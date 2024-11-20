import { Preview } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useGridApiContext, GridPreferencePanelsValue } from "@mui/x-data-grid-premium";

const ToolbarVisao = () => {
	
	const apiRef = useGridApiContext();

	return <Tooltip title={"Visão"}>
		<Box>
			<IconButton size="small" onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.columns)}>
				<Preview/>
			</IconButton>
		</Box>
	</Tooltip>
}

export default ToolbarVisao;