import { GridInitialStatePremium } from "@mui/x-data-grid-premium/models/gridStatePremium";
import { create } from "zustand";

export interface DataGridStates {
	[key: string]: GridInitialStatePremium,
}

export interface DataGridState {
	states: DataGridStates;
	setState: (key: string, state?: GridInitialStatePremium) => void;
	getState: (key: string) => GridInitialStatePremium | undefined;
}

const useDataGridStore = create<DataGridState>()((set, get) => ({
	states: {},
	setState: (key, newState) => set((state) => {
		return {
			...state,
			states: {
				...state.states,
				[key]: {...(state.states[key] || {}), ...newState},
			}
		}
	}),
	getState: (key) => get().states[key],
}));

export default useDataGridStore;