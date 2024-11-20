import { useTheme } from "@mui/material";
import { ColumnsPanelPropsOverrides, GridColDef, GridColumnGroup, GridColumnGroupingModel, GridColumnNode, GridColumnsPanelProps, GridColumnVisibilityModel, GridEventListener, GridLeafColumn, useGridApiContext, useGridApiEventHandler } from "@mui/x-data-grid-premium";
import { TreeItem, TreeViewBaseItem, useTreeViewApiRef } from "@mui/x-tree-view";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { MutableRefObject, useCallback, useContext, useMemo, useState } from "react";
import { DataGridContext } from "./DataGridContext";
import { RichTreeViewPro } from "@mui/x-tree-view-pro";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";

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

const calculateSelectedItems = (items: TreeViewBaseItem[], columnVisibilityModel: GridColumnVisibilityModel): string[] => {
	let selectedItems: string[] = [];
	items.forEach(item => {
		if (item.id.startsWith('__group__')) {
			let selectedChildren = calculateSelectedItems(item.children!, columnVisibilityModel);
			selectedItems = [...selectedItems, ...selectedChildren];
			if (selectedChildren.length == item.children?.length)
				selectedItems.push(item.id);
		} else {
			if (columnVisibilityModel?.[item.id] ?? true)
				selectedItems.push(item.id);
		}
	})
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

const CustomColumnSelector = ( props: GridColumnsPanelProps & ColumnsPanelPropsOverrides) => {
	const gridApiRef = useGridApiContext();

	const columns = useMemo<GridColDef[]>(() => gridApiRef.current.getAllColumns(), []);

	const columnGroupingModel = useContext(DataGridContext)?.columnGroupingModel ?? [];

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

export default CustomColumnSelector;