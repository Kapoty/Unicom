import { create } from 'zustand';
import { deleteTokens } from '../utils/auth';
import history from '../utils/history';
import { AuthState } from '../ts/types/authTypes';

const useAuthStore = create<AuthState>()((set) => ({
    isAuth: undefined,
    setIsAuth: (isAuth) => set({isAuth: isAuth}),
    logout: () => {
        deleteTokens();
        history.push("/login");
        set({isAuth: false});
    },
}))

export default useAuthStore;