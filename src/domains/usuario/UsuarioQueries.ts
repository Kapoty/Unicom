import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../auth/useAuthStore';
import { getMe } from './UsuarioService';

export const useUsuarioLogadoQuery = () => {

	const isAuth = useAuthStore(s => s.isAuth);

	return useQuery({
		queryKey: ['usuario', 'me'],
		queryFn: async () => getMe(),
		enabled: !!isAuth
	});
};