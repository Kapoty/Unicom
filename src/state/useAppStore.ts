import { Theme } from '@mui/material/styles';
import {create} from 'zustand'
import createCustomTheme from '../utils/theme';
import { AppState } from '../ts/types/appTypes';

const useAppStore = create<AppState>()((set) => ({
    isMobile: false,
    setMobile: (isMobile) => set({isMobile: isMobile}),
    theme: createCustomTheme(),
    setTheme: (props) => set({theme: createCustomTheme(props)})
}));

export default useAppStore;