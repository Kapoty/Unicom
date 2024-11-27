import { DataGrid, GridColumnGroupingModel } from "@mui/x-data-grid-premium";
import React, { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { DataGridVisaoParams } from "./CustomDataGrid";

export interface IDataGridContext {
	titulo?: string;
	rowSelection: boolean;
	toggleRowSelection: () => void;
	fullscreen: boolean;
	toggleFullscreen: () => void;
	stateKey?: any[];
	columnGroupingModel?: GridColumnGroupingModel;
	visao?: DataGridVisaoParams;
}

const DataGridContext = createContext<IDataGridContext | undefined>(undefined);

export const DataGridContextProvider = ({children, context}: PropsWithChildren<{context: IDataGridContext}>) => {
	return <DataGridContext.Provider value={context}>
		{children}
	</DataGridContext.Provider>
}

export const useDataGridContext = (): IDataGridContext => {
	const context = useContext(DataGridContext);

	if (!context) {
		throw new Error("useDataGridContext must be used within a DataGridContext");
	}

	return context;
}