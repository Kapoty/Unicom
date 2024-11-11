import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/usuarioService';
import useAuthStore from '../state/useAuthStore';

export const useUsuarioLogadoQuery = () => {

	const isAuth = useAuthStore(s => s.isAuth);

	return useQuery({
		queryKey: ['usuario', 'me'],
		queryFn: async () => getMe(),
		enabled: isAuth
	});
};