import { Backdrop, Badge, Box, Icon, IconButton, ListItemIcon, Menu, MenuItem, SvgIcon, Tooltip, Typography } from "@mui/material";
import { GridDensity, GridEventListener, GridFilterModel, GridPreferencePanelsValue, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter, ToolbarPropsOverrides, useGridApiContext, useGridApiEventHandler } from "@mui/x-data-grid-premium";
import TableCellSelectionIcon from '../../assets/svg/table-cell-selection.svg';
import TableRowSelectionIcon from '../../assets/svg/table-row-selection.svg';
import ExcelIcon from '../../assets/svg/excel.svg';
import { FilterAlt, Fullscreen, FullscreenExit, SaveAlt, TableRows, ViewColumn, ViewHeadline, ViewStream, Description, Preview, MoreVert } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import useAppStore from "../../state/useAppStore";

const CustomToolbar = (props: ToolbarPropsOverrides) => {

	const isMobile = useAppStore(s => s.isMobile);

	const { rowSelection, toggleRowSelection, fullscreen, toggleFullscreen, titulo, ...rest } = props;

	const apiRef = useGridApiContext();

	const [density, setDensity] = useState<GridDensity>(apiRef.current.state.density);
	const [densityMenuOpen, setDensityMenuOpen] = useState(false);
	const densityMenuRef = useRef<HTMLDivElement | null>(null);

	const handleDensityChangeEvent = useCallback<GridEventListener<"densityChange">>((params: GridDensity) => {
		setDensity(params);
	}, []);
	
	useGridApiEventHandler(apiRef, 'densityChange', handleDensityChangeEvent);

	const [filterMoldel, setfilterModel] = useState<GridFilterModel>(apiRef.current.state.filter.filterModel);

	const handlefilterModelChangeEvent = useCallback<GridEventListener<"filterModelChange">>((params: GridFilterModel) => {
		setfilterModel(params);
	}, []);

	useGridApiEventHandler(apiRef, 'filterModelChange', handlefilterModelChangeEvent);

	const [exportMenuOpen, setExportMenuOpen] = useState(false);
	const exportMenuRef = useRef<HTMLDivElement | null>(null);

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
		{titulo && <Typography variant="h5" pl={1}> {titulo} </Typography>}

		<Tooltip title={fullscreen ? "Reduzir" : "Maximizar"}>
			<Box>
				<IconButton size="small" color={fullscreen ? "primary" : 'default'} onClick={toggleFullscreen}>
					{fullscreen ? <FullscreenExit/> : <Fullscreen/>}
				</IconButton>
			</Box>
		</Tooltip>

		<Tooltip title={"Visão"}>
			<Box>
				<IconButton size="small" onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.columns)}>
					<Preview/>
				</IconButton>
			</Box>
		</Tooltip>

		{!isMobile && <Tooltip title={rowSelection ? "Modo de Seleção de Linhas" : "Modo de Seleção de Células"}>
			<Box>
				<IconButton size="small" onClick={toggleRowSelection}>
					<SvgIcon component={rowSelection ? TableRowSelectionIcon : TableCellSelectionIcon} inheritViewBox />
				</IconButton>
			</Box>
		</Tooltip>}

		<Tooltip title="Exibir Seletor de Colunas">
			<Box>
				<IconButton size="small" onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.columns)}>
					<ViewColumn/>
				</IconButton>
			</Box>
		</Tooltip>

		<Tooltip title="Filtros">
			<Box>
				<IconButton
					size="small"
					color={filterMoldel.items.length !== 0 ? 'primary' : 'default'}
					onClick={() => apiRef.current.showPreferences(GridPreferencePanelsValue.filters)}
				>
					<Badge badgeContent={filterMoldel.items.length} color="primary">
						<FilterAlt/>
					</Badge>
				</IconButton>
			</Box>
		</Tooltip>

		{!isMobile && <Tooltip title="Densidade">
			<Box ref={densityMenuRef}>
				<IconButton size="small" onClick={() => setDensityMenuOpen(true)}>
					{density == 'compact' ? <ViewHeadline/> : density == 'standard' ? <TableRows/> : <ViewStream/>}
				</IconButton>
			</Box>
		</Tooltip>}

		<Backdrop open={densityMenuOpen} invisible onClick={() => setDensityMenuOpen(false)}>
			<Menu
				anchorEl={densityMenuRef.current}
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
					<ListItemIcon><ViewHeadline/></ListItemIcon>
					Compacto
				</MenuItem>
				<MenuItem selected={density == "standard"} onClick={() => apiRef.current.setDensity('standard')}>
					<ListItemIcon><TableRows/></ListItemIcon>
					Padrão
				</MenuItem>
				<MenuItem selected={density == "comfortable"} onClick={() => apiRef.current.setDensity("comfortable")}>
					<ListItemIcon><ViewStream/></ListItemIcon>
					Confortável
				</MenuItem>
			</Menu>
		</Backdrop>

		{!isMobile && <Tooltip title="Exportar">
			<Box ref={exportMenuRef}>
				<IconButton size="small" onClick={() => setExportMenuOpen(true)}>
					<SaveAlt/>
				</IconButton>
			</Box>
		</Tooltip>}

		<Backdrop open={exportMenuOpen} invisible onClick={() => setExportMenuOpen(false)}>
			<Menu
				anchorEl={exportMenuRef.current}
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
					<ListItemIcon><Description/></ListItemIcon>
					Baixar como CSV
				</MenuItem>
				<MenuItem onClick={() => apiRef.current.exportDataAsExcel()}>
					<ListItemIcon><SvgIcon component={ExcelIcon} inheritViewBox /></ListItemIcon>
					Baixar como Excel
				</MenuItem>
			</Menu>
		</Backdrop>

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
				<MenuItem onClick={toggleRowSelection}>
					<ListItemIcon><SvgIcon component={rowSelection ? TableRowSelectionIcon : TableCellSelectionIcon} inheritViewBox /></ListItemIcon>
					{rowSelection ? "Modo de Seleção de Linhas" : "Modo de Seleção de Células"}
				</MenuItem>
				<MenuItem onClick={() => setDensityMenuOpen(true)}>
					<ListItemIcon ref={densityMenuRef}>{density == 'compact' ? <ViewHeadline/> : density == 'standard' ? <TableRows/> : <ViewStream/>}</ListItemIcon>
					Densidade
				</MenuItem>
				<MenuItem onClick={() => setExportMenuOpen(true)}>
					<ListItemIcon ref={exportMenuRef}><SaveAlt/></ListItemIcon>
					Exportar
				</MenuItem>
			</Menu>
		</Backdrop>

		{/*<Box flexGrow={1}></Box>*/}
		
		<GridToolbarQuickFilter sx={{minWidth: 100, width: 400}}/>
	</GridToolbarContainer>
}

export default CustomToolbar;