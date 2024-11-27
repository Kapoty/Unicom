import { Box, IconButton, ListItemIcon, MenuItem, SvgIcon, Tooltip } from "@mui/material";
import { useContext } from "react";
import TableCellSelectionIcon from '../../../../assets/svg/table-cell-selection.svg';
import TableRowSelectionIcon from '../../../../assets/svg/table-row-selection.svg';
import { useDataGridContext } from "../DataGridContext";

export interface ToolbarSelectionModeProps {
	menuItem?: boolean;
}

const ToolbarSelectionMode = ({ menuItem = false }: ToolbarSelectionModeProps) => {

	const { rowSelection, toggleRowSelection } = useDataGridContext()!;

	return (!menuItem ?
		<Tooltip arrow title={rowSelection ? "Modo de Seleção de Linhas" : "Modo de Seleção de Células"}>
			<Box>
				<IconButton size="small" onClick={toggleRowSelection}>
					<SvgIcon component={rowSelection ? TableRowSelectionIcon : TableCellSelectionIcon} inheritViewBox />
				</IconButton>
			</Box>
		</Tooltip> : <MenuItem onClick={toggleRowSelection}>
			<ListItemIcon><SvgIcon component={rowSelection ? TableRowSelectionIcon : TableCellSelectionIcon} inheritViewBox /></ListItemIcon>
			{rowSelection ? "Modo de Seleção de Linhas" : "Modo de Seleção de Células"}
		</MenuItem>)
}

export default ToolbarSelectionMode;