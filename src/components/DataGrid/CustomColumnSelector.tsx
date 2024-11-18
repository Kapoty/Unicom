import { ColumnsPanelPropsOverrides, GridColDef, GridColumnGroup, GridColumnGroupingModel, GridColumnNode, GridColumnsGroupingState, GridColumnsPanelProps, GridColumnVisibilityModel, GridEventListener, GridFilterModel, GridLeafColumn, useGridApiContext, useGridApiEventHandler, useGridSelector } from "@mui/x-data-grid-premium";
import { useState, useCallback, useMemo, MutableRefObject } from "react";
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { TreeItem } from "@mui/x-tree-view";

const renderTreeItems = (columnGroupingModel: GridColumnNode[]) => {
	return columnGroupingModel.map((groupOrField: GridColumnGroup | GridLeafColumn) => {
		if ('field' in groupOrField) {
			return (
				<TreeItem
					key={groupOrField.field}
					itemId={groupOrField.field}
					label={groupOrField.field}
				/>
			);
		}

		// Nó de grupo
		return (
			<TreeItem
				key={groupOrField.groupId}
				itemId={groupOrField.groupId}
				label={groupOrField.headerName || groupOrField.groupId}
			>
				{renderTreeItems(groupOrField.children!)}
			</TreeItem>
		);
	});
}

const calculateSelectedChildren = (groupOrField: GridColumnGroup | GridLeafColumn, columnVisibilityModel: GridColumnVisibilityModel) => {
	if ('field' in groupOrField)
		return {[groupOrField.field]: (columnVisibilityModel[groupOrField.field!] ?? true)}

	let selectedItems: {[key: string]: boolean} = {};
	let selected = true;
	
	for (let i=0; i < groupOrField.children.length; i++)
		selectedItems = {...selectedItems, ...calculateSelectedChildren(groupOrField.children[i], columnVisibilityModel)};

	Object.keys(selectedItems).forEach(k => {if (!selectedItems[k]) selected = false});

	if (selected)
		selectedItems[groupOrField.groupId] = true;

	return selectedItems;
}

const calculateSelectedItems = (columnGroupingModel: GridColumnGroupingModel, columnVisibilityModel: GridColumnVisibilityModel): string[] => {
	let selectedItems: string[] = [];
	let selectedChildren: {[key: string]: boolean};

	for (let i=0; i < columnGroupingModel.length; i++) {
		selectedChildren = calculateSelectedChildren(columnGroupingModel[i], columnVisibilityModel);
		selectedItems = [...selectedItems, ...Object.keys(selectedChildren).filter(k => selectedChildren[k])];
	}

	return selectedItems;
}

const CustomColumnSelector = ({ columnGroupingModel, ...props }: GridColumnsPanelProps & ColumnsPanelPropsOverrides) => {
	const apiRef = useGridApiContext();

	const columns = useMemo<GridColDef[]>(() => apiRef.current.getAllColumns(), []);

	const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(apiRef.current.state.columns.columnVisibilityModel);

	const handleColumnVisibilityModelChange = useCallback<GridEventListener<"columnVisibilityModelChange">>((params: GridColumnVisibilityModel) => {
		setColumnVisibilityModel(params);
	}, []);

	useGridApiEventHandler(apiRef, 'columnVisibilityModelChange', handleColumnVisibilityModelChange);

	const selectedItems = useMemo(() => calculateSelectedItems(columnGroupingModel, columnVisibilityModel), [columnVisibilityModel]);

	const handleSelectedItemsChange = useCallback((event: React.SyntheticEvent, itemIds: string[]) => {
		apiRef.current.setColumnVisibilityModel({
			...columns.reduce((acc, column) => {
				acc[column.field] = itemIds.includes(column.field);
				return acc;
			}, {} as { [key: string]: boolean })
		})
	}, []);

	return <SimpleTreeView
		checkboxSelection
		selectedItems={selectedItems}
		onSelectedItemsChange={handleSelectedItemsChange}
		multiSelect
	>
		{renderTreeItems(columnGroupingModel)}
	</SimpleTreeView>
}

export default CustomColumnSelector;