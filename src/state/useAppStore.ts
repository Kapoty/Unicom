import { Theme } from '@mui/material/styles';
import {create} from 'zustand'
import createCustomTheme, { ThemeProps } from '../utils/theme';

interface AppState {
    isMobile: boolean;
    setMobile: (isMobile: boolean) => void;
    theme: Theme;
    setTheme: (props?: ThemeProps) => void;
}

const useAppStore = create<AppState>()((set) => ({
    isMobile: false,
    setMobile: (isMobile) => set({isMobile: isMobile}),
    theme: createCustomTheme(),
    setTheme: (props?: ThemeProps) => set({theme: createCustomTheme(props)})
}));

export default useAppStore;