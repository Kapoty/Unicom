import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import { create } from "zustand";

export interface DataGridStates {
	[key: string]: GridInitialStatePremium,
}

export interface DataGridState {
	states: DataGridStates;
	setState: (key: any[], state?: GridInitialStatePremium) => void;
	getState: (key: any[]) => GridInitialStatePremium | undefined;
}

const arrayToKey = (array: any[]) => array.join(',');

const useDataGridStore = create<DataGridState>()((set, get) => ({
	states: {},
	setState: (key, newState) => set((state) => {
		return {
			...state,
			states: {
				...state.states,
				[arrayToKey(key)]: {...(state.states[arrayToKey(key)] || {}), ...newState},
			}
		}
	}),
	getState: (key) => get().states[arrayToKey(key)],
}));

export default useDataGridStore;