import { create } from 'zustand';
import { Theme } from '@mui/material/styles';
import { IEmpresaPublic } from '../../domains/empresa/Empresa';
import createCustomTheme, { ThemeProps } from '../utils/themeUtils';

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
    drawerOpen: true,
    setDrawerOpen: (drawerOpen) => set({drawerOpen}),
	fullscreen: false,
    setFullscreen: (fullscreen) => {
		if (fullscreen)
			document.body.requestFullscreen().catch(error => console.error(error));
		else
			document.exitFullscreen().catch(error => console.error(error));
		set({fullscreen});
	},
}));

export default useAppStore;