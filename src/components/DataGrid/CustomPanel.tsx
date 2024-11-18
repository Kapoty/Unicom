import { Backdrop, ClickAwayListener, Menu, Paper, Popover, Popper } from "@mui/material";
import { GridPanel, GridPanelProps, PanelPropsOverrides, useGridApiContext } from "@mui/x-data-grid-premium";

const CustomPanel = (props: GridPanelProps & PanelPropsOverrides) => {

	const apiRef = useGridApiContext();

	if (!props.open)
		return;

	return <Popover
				open={props.open}
				onClose={() => apiRef.current.hidePreferences()}
				anchorEl={apiRef.current.rootElementRef.current?.querySelector(".MuiDataGrid-main")}
			>
				{props.children}
			</Popover>
}

export default CustomPanel;