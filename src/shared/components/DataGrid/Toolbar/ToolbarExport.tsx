import { Description, SaveAlt } from "@mui/icons-material";
import { Backdrop, Box, IconButton, ListItemIcon, Menu, MenuItem, SvgIcon, Tooltip } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { useState, useRef } from "react";
import ExcelIcon from '../../../../assets/svg/excel.svg';

export interface ToolbarExportProps {
	menuItem?: boolean;
}

const ToolbarExport = ({ menuItem = false }: ToolbarExportProps) => {

	const apiRef = useGridApiContext();

	const [exportMenuOpen, setExportMenuOpen] = useState(false);
	const exportMenuRef = useRef<HTMLDivElement | null>(null);

	return <>
		{!menuItem ?
			<Tooltip arrow title="Exportar">
				<Box ref={exportMenuRef}>
					<IconButton size="small" onClick={() => setExportMenuOpen(true)}>
						<SaveAlt />
					</IconButton>
				</Box>
			</Tooltip> :
			<MenuItem onClick={() => setExportMenuOpen(true)}>
				<ListItemIcon ref={exportMenuRef}><SaveAlt /></ListItemIcon>
				Exportar
			</MenuItem>
		}

		<Backdrop open={exportMenuOpen} invisible onClick={() => setExportMenuOpen(false)}>
			<Menu
				anchorEl={exportMenuRef.current}
				container={exportMenuRef.current}
				open={exportMenuOpen}
				onClose={() => setExportMenuOpen(false)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<MenuItem onClick={() => apiRef.current.exportDataAsCsv()}>
					<ListItemIcon><Description /></ListItemIcon>
					Baixar como CSV
				</MenuItem>
				<MenuItem onClick={() => apiRef.current.exportDataAsExcel()}>
					<ListItemIcon><SvgIcon component={ExcelIcon} inheritViewBox /></ListItemIcon>
					Baixar como Excel
				</MenuItem>
			</Menu>
		</Backdrop>
	</>
}

export default ToolbarExport;