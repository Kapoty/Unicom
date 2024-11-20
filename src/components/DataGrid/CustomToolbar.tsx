import { MoreVert } from "@mui/icons-material";
import { Backdrop, Box, IconButton, Menu, Tooltip } from "@mui/material";
import { GridToolbarContainer, GridToolbarProps, GridToolbarQuickFilter, ToolbarPropsOverrides, useGridApiContext } from "@mui/x-data-grid-premium";
import { useRef, useState } from "react";
import useAppStore from "../../state/useAppStore";
import ToolbarColumnSelector from "./Toolbar/ToolbarColumnSelector";
import ToolbarDensity from "./Toolbar/ToolbarDensity";
import ToolbarExport from "./Toolbar/ToolbarExport";
import ToolbarFiltros from "./Toolbar/ToolbarFiltros";
import ToolbarFullscreen from "./Toolbar/ToolbarFullscreen";
import ToolbarSelectionMode from "./Toolbar/ToolbarSelectionMode";
import ToolbarTitulo from "./Toolbar/ToolbarTitulo";
import ToolbarVisao from "./Toolbar/ToolbarVisao";

declare module '@mui/x-data-grid' {
	interface ToolbarPropsOverrides {
		titulo: string;
		rowSelection: boolean;
		toggleRowSelection: () => void;
		fullscreen: boolean;
		toggleFullscreen: () => void;
	}
}

const CustomToolbar = (props: GridToolbarProps  & ToolbarPropsOverrides) => {

	const isMobile = useAppStore(s => s.isMobile);

	const apiRef = useGridApiContext();

	const [moreMenuOpen, setMoreMenuOpen] = useState(false);
	const moreMenuRef = useRef<HTMLDivElement | null>(null);

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
		<ToolbarVisao/>
		{!isMobile && <ToolbarSelectionMode/>}
		<ToolbarColumnSelector/>
		<ToolbarFiltros/>
		{!isMobile && <ToolbarDensity/>}
		{!isMobile && <ToolbarExport/>}

		{isMobile && <Tooltip title="Mais">
			<Box ref={moreMenuRef}>
				<IconButton size="small" onClick={() => setMoreMenuOpen(true)}>
					<MoreVert/>
				</IconButton>
			</Box>
		</Tooltip>}

		<Backdrop open={moreMenuOpen}>
			<Menu
				anchorEl={moreMenuRef.current}
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