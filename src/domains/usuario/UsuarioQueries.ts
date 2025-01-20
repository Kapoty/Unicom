import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../auth/useAuthStore';
import { getMe, getUsuarioAdminByEmpresaIdAndUsuarioId, getUsuarioPublicByUsuarioId, getUsuariosAdminByEmpresaId } from './UsuarioService';
import { UsuarioBuscarRequest } from './UsuarioPayloads';

export const useUsuarioLogadoQuery = () => {

	const isAuth = useAuthStore(s => s.isAuth);

	return useQuery({
		queryKey: ['usuario', 'me'],
		queryFn: async () => getMe(),
		enabled: !!isAuth
	});
};

export const useUsuariosAdminByEmpresaIdQuery = (empresaId?: number) => {
	return useQuery({
			queryKey: ['usuarios', 'empresas', empresaId, 'admin'],
			queryFn: async () => getUsuariosAdminByEmpresaId(empresaId!),
			enabled: !!empresaId,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		});
};

export const useUsuarioAdminByEmpresaIdAndUsuarioIdQuery = (empresaId?: number, usuarioId?: number) => {

	return useQuery({
		queryKey: ['usuarios', 'empresas', empresaId, usuarioId, 'admin'],
		queryFn: async () => getUsuarioAdminByEmpresaIdAndUsuarioId(empresaId!, usuarioId!),
		enabled: !!empresaId && !!usuarioId
	});
};

export const useUsuarioPublicByUsuarioIdQuery = (usuarioId?: number) => {

	return useQuery({
		queryKey: ['usuarios', usuarioId, 'public'],
		queryFn: async () => getUsuarioPublicByUsuarioId(usuarioId!),
		enabled: !!usuarioId
	});
};