import { Paper, Popover, SwipeableDrawer } from "@mui/material";
import { GridColumnGroupingModel, GridPanelProps, PanelPropsOverrides, useGridApiContext } from "@mui/x-data-grid-premium";
import useAppStore from "../../state/useAppStore";


declare module '@mui/x-data-grid' {
	interface ColumnsPanelPropsOverrides {
		columnGroupingModel: GridColumnGroupingModel;
	}
}

const CustomPanel = (props: GridPanelProps & PanelPropsOverrides) => {

	const apiRef = useGridApiContext();

	const isMobile = useAppStore(s => s.isMobile);

	if (!props.open)
		return;

	if (!isMobile)
		return <Popover
			open
			onClose={() => apiRef.current.hidePreferences()}
			anchorEl={apiRef.current.rootElementRef.current?.querySelector(".MuiDataGrid-main")}
		>
			{props.children}
		</Popover>

	return <Popover
		open
		anchorReference="none"
		onClose={() => apiRef.current.hidePreferences()}
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}
	>
		{props.children}
	</Popover>
}

export default CustomPanel;