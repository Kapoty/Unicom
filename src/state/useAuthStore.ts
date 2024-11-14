import { create } from 'zustand';
import { deleteTokens } from '../utils/authUtil';
import browserHistory from '../utils/browserHistory';
import { AuthState } from '../ts/types/authTypes';
import { queryClient } from '../App';

const useAuthStore = create<AuthState>()((set) => ({
    isAuth: undefined,
	setIsAuth: (isAuth) => set({isAuth}),
    login: (redirect = '/') => {
		console.log(redirect)
		set({isAuth: true});
		queryClient.removeQueries({ queryKey: ['usuario', 'me'] });
		browserHistory.push(redirect);
	},
    logout: (redirect = false) => {
        if (!browserHistory.location.pathname.startsWith("/login")) {
            deleteTokens();

            if (redirect && browserHistory.location.pathname !== "/")
                browserHistory.push(`/login?redirect=${browserHistory.location.pathname}`);
            else
                browserHistory.push('/login');
            
            set({isAuth: false});
        }
    },
}))

export default useAuthStore;