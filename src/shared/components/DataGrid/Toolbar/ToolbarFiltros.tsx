import { FilterAlt } from "@mui/icons-material";
import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import { GridEventListener, GridFilterModel, GridPreferencePanelsValue, useGridApiContext, useGridApiEventHandler } from "@mui/x-data-grid-premium";
import { useCallback, useState } from "react";

const ToolbarFiltros = () => {

	const apiRef = useGridApiContext();

	const [filterMoldel, setfilterModel] = useState<GridFilterModel>(apiRef.current.state.filter.filterModel);

	const handlefilterModelChangeEvent = useCallback<GridEventListener<"filterModelChange">>((params: GridFilterModel) => {
		setfilterModel(params);
	}, []);

	useGridApiEventHandler(apiRef, 'filterModelChange', handlefilterModelChangeEvent);

	return <Tooltip arrow title="Filtros">
		<Box>
			<IconButton
				size="small"
				color={filterMoldel.items.length !== 0 ? 'primary' : 'default'}
				onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.filters)}
			>
				<Badge badgeContent={filterMoldel.items.length} color="primary">
					<FilterAlt />
				</Badge>
			</IconButton>
		</Box>
	</Tooltip>
}

export default ToolbarFiltros;