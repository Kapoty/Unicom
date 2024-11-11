import { useEffect } from 'react';
import {getAccessToken} from '../../utils/auth';
import useAuthStore from '../../state/useAuthStore';

const useAuthSync = () => {
	const isAuth = getAccessToken() !== undefined;
	const setIsAuth = useAuthStore((state) => state.setIsAuth);

	useEffect(() => {
		setIsAuth(isAuth);
	}, []);
};

export default useAuthSync;