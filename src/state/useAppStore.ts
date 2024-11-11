import {create} from 'zustand'
import createCustomTheme from '../utils/theme';
import { AppState } from '../ts/types/appTypes';

const useAppStore = create<AppState>()((set, get) => ({
    isMobile: false,
    setMobile: (isMobile) => set({isMobile}),
    theme: createCustomTheme(),
    setTheme: (props) => set({theme: createCustomTheme(props)}),
    empresa: undefined,
    setEmpresa: (empresa) => set({empresa}),
    drawerOpen: false,
    setDrawerOpen: (drawerOpen) => set({drawerOpen}),
	fullscreen: false,
    setFullscreen: (fullscreen) => {
		if (fullscreen)
			document.body.requestFullscreen();
		else
			document.exitFullscreen();
		set({fullscreen});
	},
}));

export default useAppStore;