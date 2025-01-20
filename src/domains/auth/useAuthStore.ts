import { create } from 'zustand';
import { deleteTokens } from '../../shared/utils/authUtil';
import browserHistory from '../../shared/utils/browserHistory';
import queryClient from '../../shared/utils/queryClient';

export interface AuthState {
	isAuth?: boolean;
	setIsAuth: (isAuth?: boolean) => void;
	login: (redirect?: string) => void;
	logout: (redirect?: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
	isAuth: undefined,
	setIsAuth: (isAuth) => set({isAuth}),
	login: (redirect = '/') => {
		set({isAuth: true});
		queryClient.removeQueries();
		browserHistory.push(redirect);
	},
	logout: (redirect = false) => {
		if (!browserHistory.location.pathname.startsWith("/login")) {
			deleteTokens();

			queryClient.removeQueries();

			if (redirect && browserHistory.location.pathname !== "/")
				browserHistory.push(`/login?redirect=${browserHistory.location.pathname}`);
			else
				browserHistory.push('/login');
			
			set({isAuth: false});
		}
	},
}))

export default useAuthStore;