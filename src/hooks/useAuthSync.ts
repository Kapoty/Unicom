import { useEffect } from 'react';
import {getAccessToken} from '../utils/auth';
import useAuthStore from '../state/useAuthStore';

const useAuthSync = () => {
	const isAuth = getAccessToken() !== undefined;
	const setIsAuth = useAuthStore((state) => state.setIsAuth);

	useEffect(() => {
		setTimeout(() => setIsAuth(isAuth), 1000);
	}, []);
};

export default useAuthSync;