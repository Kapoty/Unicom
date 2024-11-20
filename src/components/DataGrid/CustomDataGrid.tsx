import { DataGridPremium, DataGridPremiumProps, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD, gridClasses, GridColumnGroupingModel, GridEventListener, useGridApiRef } from "@mui/x-data-grid-premium"
import useAppStore from "../../state/useAppStore";
import { darken, Input, lighten, styled, TextField } from "@mui/material";
import { Padding } from "@mui/icons-material";
import CustomToolbar from "./CustomToolbar";
import { forwardRef, LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import CustomColumnSelector from "./CustomColumnSelector";
import CustomPanel from "./CustomPanel";
import { DataGridContext, IDataGridContext } from "./DataGridContext";
import useDataGridStore from "../../state/useDataGridStore";

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
	titulo?: string;
	stateKey?: any[];
}

const CustomDataGrid = ({ titulo, apiRef, stateKey, columnGroupingModel, ...props }: CustomDataGridProps) => {

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

	const dataGridContext: IDataGridContext = useMemo(() => ({
		titulo: titulo,
		rowSelection: rowSelection,
		toggleRowSelection: toggleRowSelection,
		fullscreen: fullscreen,
		toggleFullscreen: toggleFullscreen,
		stateKey: stateKey,
		columnGroupingModel: columnGroupingModel,
	}), [titulo, rowSelection, setRowSelection, fullscreen, setFullscreen, columnGroupingModel]);

	const setDataGridState = useDataGridStore(s => s.setState);

	const handleStateChange = useCallback<GridEventListener<"stateChange">>(() => {
		setDataGridState(stateKey!, apiRef.current.exportState());
	}, []);

	useEffect(() => {

		if (stateKey) {

			const dataGridState = useDataGridStore.getState().getState(stateKey);

			if (dataGridState)
				apiRef.current.restoreState(dataGridState);

			const unsubscribe = apiRef.current.subscribeEvent('stateChange', handleStateChange);

			return () => unsubscribe();

		}

	}, []);

	return <DataGridContext.Provider value={dataGridContext}>
		<StyledDataGrid

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
			}}

			rowSelection={rowSelection}
			cellSelection={!rowSelection}
			checkboxSelection={rowSelection}

			columnGroupingModel={columnGroupingModel}

			getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}

			pageSizeOptions={[1, 10, 50, 100]}

			apiRef={apiRef}
		>

		</StyledDataGrid>
	</DataGridContext.Provider>
}

export default CustomDataGrid;