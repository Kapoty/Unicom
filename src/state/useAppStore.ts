import { create } from 'zustand';
import createCustomTheme, { ThemeProps } from '../utils/customTheme';
import { Theme } from '@mui/material/styles';
import { IEmpresaPublic } from '../models/Empresa';

export interface AppState {
	online: boolean;
	setOnline: () => void;
	setOffline: () => void;
    isMobile: boolean;
    setMobile: (isMobile: boolean) => void;
    theme: Theme;
    setTheme: (props?: ThemeProps) => void;
    empresa?: IEmpresaPublic,
    setEmpresa: (empresa?: IEmpresaPublic) => void;
    drawerOpen: boolean;
    setDrawerOpen: (drawerOpen: boolean) => void;
	fullscreen: boolean;
    setFullscreen: (fullscreen: boolean) => void;
}

const useAppStore = create<AppState>()((set, get) => ({
	online: true,
    setOnline: () => set({online: true}),
	setOffline: () => set({online: false}),
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
		try {
			if (fullscreen)
				document.body.requestFullscreen();
			else
				document.exitFullscreen();

			set({fullscreen});
		} catch (error) {
			console.error(error);
		}
	},
}));

export default useAppStore;