import { MoreVert } from "@mui/icons-material";
import { Backdrop, Box, IconButton, Menu, Tooltip } from "@mui/material";
import { GridToolbarContainer, GridToolbarProps, GridToolbarQuickFilter, ToolbarPropsOverrides, useGridApiContext } from "@mui/x-data-grid-premium";
import { useRef, useState } from "react";
import ToolbarColumnSelector from "./ToolbarColumnSelector";
import ToolbarDensity from "./ToolbarDensity";
import ToolbarExport from "./ToolbarExport";
import ToolbarFiltros from "./ToolbarFiltros";
import ToolbarFullscreen from "./ToolbarFullscreen";
import ToolbarSelectionMode from "./ToolbarSelectionMode";
import ToolbarTitulo from "./ToolbarTitulo";
import ToolbarVisao from "./ToolbarVisao";
import { useDataGridContext } from "../DataGridContext";
import useAppStore from "../../../state/useAppStore";

declare module '@mui/x-data-grid' {
	interface ToolbarPropsOverrides {
		titulo: string;
		rowSelection: boolean;
		toggleRowSelection: () => void;
		fullscreen: boolean;
		toggleFullscreen: () => void;
	}
}

const CustomToolbar = (props: GridToolbarProps & ToolbarPropsOverrides) => {

	const isMobile = useAppStore(s => s.isMobile);

	const [moreMenuOpen, setMoreMenuOpen] = useState(false);
	const moreMenuRef = useRef<HTMLDivElement | null>(null);
	
	const dataGridContext = useDataGridContext()!;

	return <GridToolbarContainer
			sx={{
				flexWrap: 'nowrap',
				overflow: 'auto',
				'::-webkit-scrollbar': { 
					display: 'none'
				}
			}}
		>
		
		<ToolbarFullscreen/>
		<ToolbarTitulo/>
		{dataGridContext.visao && <ToolbarVisao/>}
		{!isMobile && <ToolbarSelectionMode/>}
		<ToolbarColumnSelector/>
		<ToolbarFiltros/>
		{!isMobile && <ToolbarDensity/>}
		{!isMobile && <ToolbarExport/>}

		{isMobile && <Tooltip arrow title="Mais">
			<Box ref={moreMenuRef}>
				<IconButton size="small" onClick={() => setMoreMenuOpen(true)}>
					<MoreVert/>
				</IconButton>
			</Box>
		</Tooltip>}

		<Backdrop open={moreMenuOpen}>
			<Menu
				anchorEl={moreMenuRef.current}
				container={moreMenuRef.current}
				open={moreMenuOpen}
				onClose={() => setMoreMenuOpen(false)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<ToolbarSelectionMode menuItem/>
				<ToolbarDensity menuItem/>
				<ToolbarExport menuItem/>
			</Menu>
		</Backdrop>
		
		<GridToolbarQuickFilter sx={{minWidth: 100, width: 400}}/>
	</GridToolbarContainer>
}

export default CustomToolbar;