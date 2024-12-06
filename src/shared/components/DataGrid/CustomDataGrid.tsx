import { darken, lighten, styled } from "@mui/material";
import { DataGridPremium, DataGridPremiumProps, gridClasses, GridEventListener, useGridApiRef } from "@mui/x-data-grid-premium";
import { GridInitialStatePremium, GridStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IDatagridVisao } from "../../../domains/datagridVisao/DatagridVisao";
import { useDatagridsVisoesByDatagridQuery } from "../../../domains/datagridVisao/DatagridVisaoQueries";
import { useDatagridVisaoAtualByDatagridQuery } from "../../../domains/datagridVisaoAtual/DatagridVisaoAtualQueries";
import useAppStore from "../../state/useAppStore";
import useDataGridStore from "../../state/useDataGridStore";
import { DataGridContextProvider, IDataGridContext } from "./DataGridContext";
import CustomColumnsPanel from "./Panel/CustomColumnsPanel";
import CustomPanel from "./Panel/CustomPanel";
import CustomToolbar from "./Toolbar/CustomToolbar";

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

export interface DataGridVisaoParams {
	datagrid?: string;
	visoesPadrao?: IDatagridVisao[];
}

export interface CustomDataGridProps extends DataGridPremiumProps {
	titulo?: string;
	stateKey?: any[];
	visao?: DataGridVisaoParams;
}

const CustomDataGrid = ({ titulo, apiRef, stateKey, columnGroupingModel, visao, ...props }: CustomDataGridProps) => {

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
		visao: visao,
	}), [titulo, rowSelection, setRowSelection, fullscreen, setFullscreen, columnGroupingModel]);

	/* Aplicar visão inicial */

	const {data: datagridsVisoes} = useDatagridsVisoesByDatagridQuery(visao?.datagrid);
	const {data: visaoAtual} = useDatagridVisaoAtualByDatagridQuery(visao?.datagrid);

	const [shouldAplicarVisaoInicial, setShouldAplicarVisaoInicial] = useState(false);

	useEffect(() => {
		if (shouldAplicarVisaoInicial && datagridsVisoes && visaoAtual) {
			setShouldAplicarVisaoInicial(false);
			let datagridVisao: IDatagridVisao | undefined;

			if (visaoAtual.tipo == 'PADRAO')
				datagridVisao = visao?.visoesPadrao?.find(d => d.nome == visaoAtual.nome);
			else
				datagridVisao = datagridsVisoes.find(d => d.datagridVisaoId == visaoAtual.datagridVisaoId);

			if (datagridVisao)
				apiRef.current.restoreState(datagridVisao.state as GridInitialStatePremium);
		}
	}, [datagridsVisoes, visaoAtual, shouldAplicarVisaoInicial]);

	/* Sincronizar estado local */

	const setDataGridState = useDataGridStore(s => s.setState);

	const handleStateChange = useCallback<GridEventListener<"stateChange">>(() => {
		setDataGridState(stateKey!, apiRef.current.exportState());
	}, []);
	
	useEffect(() => {

		if (stateKey) {

			const dataGridState = useDataGridStore.getState().getState(stateKey);

			if (dataGridState)
				apiRef.current.restoreState(dataGridState);
			else
				setShouldAplicarVisaoInicial(true);
			const unsubscribe = apiRef.current.subscribeEvent('stateChange', handleStateChange);

			return () => unsubscribe();

		} else {
			setShouldAplicarVisaoInicial(true);
		}

	}, []);

	return <DataGridContextProvider context={dataGridContext}>
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
				...(visao?.visoesPadrao?.[0].state as GridInitialStatePremium),
			}}

			slots={{
				toolbar: CustomToolbar,
				...(isMobile ? {headerFilterMenu: null} : {}),
				columnsPanel: CustomColumnsPanel,
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
	</DataGridContextProvider>
}

export default CustomDataGrid;