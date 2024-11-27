import { ViewColumn } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridPreferencePanelsValue, useGridApiContext } from "@mui/x-data-grid-premium";

const ToolbarColumnSelector = () => {

	const apiRef = useGridApiContext();

	return <Tooltip arrow title="Exibir Seletor de Colunas">
		<Box>
			<IconButton size="small" onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.columns)}>
				<ViewColumn />
			</IconButton>
		</Box>
	</Tooltip>
}

export default ToolbarColumnSelector;