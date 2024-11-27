import { useTheme } from "@mui/material";
import { ColumnsPanelPropsOverrides, GridColDef, GridColumnGroup, GridColumnGroupingModel, GridColumnsPanelProps, GridColumnVisibilityModel, GridEventListener, GridLeafColumn, useGridApiContext, useGridApiEventHandler } from "@mui/x-data-grid-premium";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { TreeViewBaseItem, useTreeViewApiRef } from "@mui/x-tree-view";
import { RichTreeViewPro } from "@mui/x-tree-view-pro";
import { MutableRefObject, useCallback, useContext, useMemo, useState } from "react";
import { useDataGridContext } from "../DataGridContext";
import { boolean } from "zod";

const calculateGroupOrFieldItems = (groupOrField: GridColumnGroup | GridLeafColumn, columnsByField: Record<string, GridColDef>): TreeViewBaseItem => {
	if ('field' in groupOrField) {
		return {
			id: groupOrField.field,
			label: columnsByField?.[groupOrField.field]?.headerName || groupOrField.field,
		}
	}

	return {
		id: `__group__${groupOrField.groupId}`,
		label: groupOrField.headerName || groupOrField.groupId,
		children: groupOrField?.children?.map(child => calculateGroupOrFieldItems(child, columnsByField)) ?? undefined, 
	}
}

const calculateItems = (columnGroupingModel: GridColumnGroupingModel, columns: GridColDef[]): TreeViewBaseItem[] => {
	let items: TreeViewBaseItem[];
	const columnsByField: Record<string, GridColDef> = columns.reduce((acc, column) => {
		acc[column.field] = column;
		return acc;
	}, {} as Record<string, GridColDef>);
	items = columnGroupingModel.map(columnGroup => calculateGroupOrFieldItems(columnGroup, columnsByField));
	return items;
}

const calculateSelectedItemsDict = (items: TreeViewBaseItem[], columnVisibilityModel: GridColumnVisibilityModel): {[key: string]: boolean} => {
	let selectedItemsDict: {[itemId: string]: boolean} = {};
	items.forEach(item => {
		if (item.id.startsWith('__group__')) {
			let selectedChildren = calculateSelectedItemsDict(item.children!, columnVisibilityModel);
			selectedItemsDict = {...selectedItemsDict, ...selectedChildren};
			selectedItemsDict[item.id] = !Object.keys(selectedChildren).some(childItemId => !selectedChildren[childItemId]);
		} else {
			selectedItemsDict[item.id] = columnVisibilityModel?.[item.id] ?? true;
		}
	})
	return selectedItemsDict;
}

const calculateSelectedItems = (items: TreeViewBaseItem[], columnVisibilityModel: GridColumnVisibilityModel): string[] => {
	const selectedItemsDict = calculateSelectedItemsDict(items, columnVisibilityModel);
	const selectedItems = Object.keys(selectedItemsDict).filter(itemId => selectedItemsDict[itemId]);
	return selectedItems;
}

const setItemSelected = (itemId: string, isSelected: boolean, selectedItems: string[], treeViewApiRef: any, gridApiRef: MutableRefObject<GridApiPremium>) => {
	if (itemId.startsWith('__group__'))
		treeViewApiRef.current?.
			getItemOrderedChildrenIds(itemId).
			forEach((childItemId: string) => setItemSelected(childItemId, isSelected, selectedItems, treeViewApiRef, gridApiRef));
	else
		gridApiRef.current.setColumnVisibility(itemId, isSelected);
}

const CustomColumnsPanel = ( props: GridColumnsPanelProps & ColumnsPanelPropsOverrides) => {
	const gridApiRef = useGridApiContext();

	const columns = useMemo<GridColDef[]>(() => gridApiRef.current.getAllColumns(), []);

	const columnGroupingModel = useDataGridContext().columnGroupingModel ?? [];

	const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(gridApiRef.current.state.columns.columnVisibilityModel);

	const handleColumnVisibilityModelChange = useCallback<GridEventListener<"columnVisibilityModelChange">>((params: GridColumnVisibilityModel) => {
		setColumnVisibilityModel(params);
	}, []);

	useGridApiEventHandler(gridApiRef, 'columnVisibilityModelChange', handleColumnVisibilityModelChange);

	const treeViewApiRef = useTreeViewApiRef();
	
	const items: TreeViewBaseItem[] = useMemo(() => calculateItems(columnGroupingModel, columns), [columns, columnGroupingModel]);

	const selectedItems: string[] = useMemo(() => calculateSelectedItems(items, columnVisibilityModel),
		[items, columnVisibilityModel, treeViewApiRef]);

	const handleItemSelectionToggle = useCallback((event: React.SyntheticEvent, itemId: string, isSelected: boolean) => {
		setItemSelected(itemId, isSelected, selectedItems, treeViewApiRef, gridApiRef);
	}, [items, selectedItems, gridApiRef]);

	const theme = useTheme();

	return <RichTreeViewPro
		checkboxSelection
		items={items}
		selectedItems={selectedItems}
		multiSelect
		onItemSelectionToggle={handleItemSelectionToggle}
		sx={{
			'&.MuiRichTreeViewPro-root': {
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(1),
				maxHeight: 444,
				overflow: 'auto',
			},
			'& .MuiTreeItem-content': {
				height: 36,
				borderRadius: 14,
			}
		}}
		apiRef={treeViewApiRef}
	>
	</RichTreeViewPro>
}

export default CustomColumnsPanel;