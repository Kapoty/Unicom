import { useEffect } from 'react';
import {getAccessToken} from '../../shared/utils/authUtil';
import useAuthStore from './useAuthStore';

const useAuthSync = () => {
	const isAuth = getAccessToken() !== undefined;
	const setIsAuth = useAuthStore((state) => state.setIsAuth);

	useEffect(() => {
		setIsAuth(isAuth);
	}, []);
};

export default useAuthSync;