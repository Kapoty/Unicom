import { TableRows, ViewHeadline, ViewStream } from "@mui/icons-material";
import { Backdrop, Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { GridDensity, GridEventListener, useGridApiContext, useGridApiEventHandler } from "@mui/x-data-grid-premium";
import { useCallback, useRef, useState } from "react";


export interface ToolbarDensityProps {
	menuItem?: boolean;
}

const ToolbarDensity = ({ menuItem = false }: ToolbarDensityProps) => {

	const apiRef = useGridApiContext();

	const [density, setDensity] = useState<GridDensity>(apiRef.current.state.density);
	const [densityMenuOpen, setDensityMenuOpen] = useState(false);
	const densityMenuRef = useRef<HTMLDivElement | null>(null);

	const handleDensityChangeEvent = useCallback<GridEventListener<"densityChange">>((params: GridDensity) => {
		setDensity(params);
	}, []);

	useGridApiEventHandler(apiRef, 'densityChange', handleDensityChangeEvent);

	return <>
		{!menuItem ?
			<Tooltip arrow title="Densidade">
				<Box ref={densityMenuRef}>
					<IconButton size="small" onClick={() => setDensityMenuOpen(true)}>
						{density == 'compact' ? <ViewHeadline /> : density == 'standard' ? <TableRows /> : <ViewStream />}
					</IconButton>
				</Box>
			</Tooltip> :
			<MenuItem onClick={() => setDensityMenuOpen(true)}>
				<ListItemIcon ref={densityMenuRef}>{density == 'compact' ? <ViewHeadline /> : density == 'standard' ? <TableRows /> : <ViewStream />}</ListItemIcon>
				Densidade
			</MenuItem>
		}

		<Backdrop open={densityMenuOpen} invisible onClick={() => setDensityMenuOpen(false)}>
			<Menu
				anchorEl={densityMenuRef.current}
				container={densityMenuRef.current}
				open={densityMenuOpen}
				onClose={() => setDensityMenuOpen(false)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<MenuItem selected={density == "compact"} onClick={() => apiRef.current.setDensity('compact')}>
					<ListItemIcon><ViewHeadline /></ListItemIcon>
					Compacto
				</MenuItem>
				<MenuItem selected={density == "standard"} onClick={() => apiRef.current.setDensity('standard')}>
					<ListItemIcon><TableRows /></ListItemIcon>
					Padrão
				</MenuItem>
				<MenuItem selected={density == "comfortable"} onClick={() => apiRef.current.setDensity("comfortable")}>
					<ListItemIcon><ViewStream /></ListItemIcon>
					Confortável
				</MenuItem>
			</Menu>
		</Backdrop>

	</>
}

export default ToolbarDensity;