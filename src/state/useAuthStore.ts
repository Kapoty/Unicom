import { create } from 'zustand';
import { deleteTokens } from '../utils/auth';
import history from '../utils/history';
import { AuthState } from '../ts/types/authTypes';
import { queryClient } from '../App';

const useAuthStore = create<AuthState>()((set) => ({
    isAuth: undefined,
    setIsAuth: (isAuth) => set({isAuth: isAuth}),
    logout: (redirect = false) => {
        if (!history.location.pathname.startsWith("/login")) {
            deleteTokens();

            if (redirect && history.location.pathname !== "/")
                history.push(`/login?redirect=${history.location.pathname}`);
            else
                history.push('/login');
            
            set({isAuth: false});
            queryClient.removeQueries({ queryKey: ['usuario', 'me'] });
        }
    },
}))

export default useAuthStore;