import { GridColumnGroupingModel } from "@mui/x-data-grid-premium";
import React, { createContext } from "react";

export interface IDataGridContext {
	titulo?: string;
	rowSelection: boolean;
	toggleRowSelection: () => void;
	fullscreen: boolean;
	toggleFullscreen: () => void;
	stateKey?: any[];
	columnGroupingModel?: GridColumnGroupingModel;
}

export const DataGridContext = createContext<IDataGridContext | undefined>(undefined);