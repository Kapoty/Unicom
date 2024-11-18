import { DataGridPremium, DataGridPremiumProps, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD, gridClasses, GridColumnGroupingModel, useGridApiRef } from "@mui/x-data-grid-premium"
import useAppStore from "../../state/useAppStore";
import { darken, Input, lighten, styled, TextField } from "@mui/material";
import { Padding } from "@mui/icons-material";
import CustomToolbar from "./CustomToobar";
import { forwardRef, LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import CustomColumnSelector from "./CustomColumnSelector";
import CustomPanel from "./CustomPanel";

declare module '@mui/x-data-grid' {
	interface ToolbarPropsOverrides {
		titulo: string;
		rowSelection: boolean;
		toggleRowSelection: () => void;
		fullscreen: boolean;
		toggleFullscreen: () => void;
	}

	interface ColumnsPanelPropsOverrides {
		columnGroupingModel: GridColumnGroupingModel;
	}
}

const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
	borderRadius: 14,
	[`& .${gridClasses.row}.even`]: {
		backgroundColor: theme.palette.background.light,
		'&:hover': {
			backgroundColor: lighten(theme.palette.background.light!, 0.1),
		},
		'&.Mui-selected': {
			backgroundColor: darken(theme.palette.primary.main, 0.8),
			'&:hover': {
				backgroundColor: darken(theme.palette.primary.main, 0.7),
			},
		},
	},
	[`& .${gridClasses.row}.odd`]: {
		backgroundColor: theme.palette.background.default,
		'&:hover': {
			backgroundColor: lighten(theme.palette.background.default, 0.1),
		},
		'&.Mui-selected': {
			backgroundColor: darken(theme.palette.primary.main, 0.8),
			'&:hover': {
				backgroundColor: darken(theme.palette.primary.main, 0.7),
			},
		},
	},
}));

interface CustomDataGridProps extends DataGridPremiumProps {
	titulo?: string
}

const CustomDataGrid = ({ titulo, apiRef, ...props }: CustomDataGridProps) => {

	apiRef = apiRef ?? useGridApiRef();

	const isMobile = useAppStore(s => s.isMobile);
	const [rowSelection, setRowSelection] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);

	const toggleFullscreen = useCallback(() => {
		if (!fullscreen)
			apiRef?.current?.rootElementRef?.current?.requestFullscreen().catch(error => console.error(error));
		else
			document.exitFullscreen().catch(error => console.error(error));
		setFullscreen(!fullscreen);
	}, [fullscreen]);

	const toggleRowSelection = useCallback(() => {
		setRowSelection(!rowSelection);
	}, [rowSelection]);

	return <StyledDataGrid

		showCellVerticalBorder

		{...props}

		pagination
		headerFilters
		headerFilterHeight={56}
		columnHeaderHeight={56}
		ignoreDiacritics

		initialState={{
			density: isMobile ? "standard" : "compact",
			...props.initialState,
		}}

		slots={{
			toolbar: CustomToolbar,
			headerFilterMenu: null,
			columnsPanel: CustomColumnSelector,
			panel: CustomPanel,
		}}

		slotProps={{
			toolbar: {
				rowSelection: rowSelection,
				toggleRowSelection: toggleRowSelection,
				fullscreen: fullscreen,
				toggleFullscreen: toggleFullscreen,
				titulo: titulo,
			},
			loadingOverlay: {
				variant: 'circular-progress',
				noRowsVariant: 'skeleton',
			},
			headerFilterCell: {
				InputComponentProps: {
					label: ""
				}
			},
			panel: {
				sx: {
					"& .MuiDataGrid-panelWrapper": {
						maxWidth: "calc(100vw - 4rem)",
					},
				},
			},
			columnsPanel: {
				columnGroupingModel: props.columnGroupingModel
			}
		}}

		rowSelection={rowSelection}
		cellSelection={!rowSelection}
		checkboxSelection={rowSelection}

		getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}

		pageSizeOptions={[1, 10, 50, 100]}

		apiRef={apiRef}
	>

	</StyledDataGrid>
}

export default CustomDataGrid;