import { useQuery } from '@tanstack/react-query';
import { useUsuarioLogadoQuery } from '../usuario/UsuarioQueries';
import useEmpresaIdParam from '../../shared/hooks/useEmpresaIdParam';
import { getPerfilAdminByEmpresaIdAndPerfilId, getPerfilById, getPerfilByUsuarioIdAndEmpresaId, getPerfisAdminByEmpresaId, getPerfisByEmpresaId, getPerfisByUsuarioIdAndEmpresaId } from './PerfilService';

export const usePerfilQuery = (perfilId?: number) => {

	return useQuery({
		queryKey: ['perfis', perfilId],
		queryFn: async () => getPerfilById(perfilId!),
		enabled: !!perfilId
	});
};

export const usePerfilAtualQuery = () => {

	const {data: usuario} = useUsuarioLogadoQuery();
	
	let empresaId = useEmpresaIdParam();
	if (!empresaId)
		empresaId = usuario?.empresaPrincipalId;

	return useQuery({
		queryKey: ['perfis', 'usuarios', usuario?.usuarioId, 'empresas', empresaId],
		queryFn: async () => getPerfilByUsuarioIdAndEmpresaId(usuario!.usuarioId, empresaId!),
		enabled: !!usuario && !!empresaId
	});
};

export const usePerfisByUsuarioIdAndEmpresaIdQuery = (usuarioId?: number, empresaId?: number) => {

	return useQuery({
		queryKey: ['perfis', 'usuarios', usuarioId],
		queryFn: async () => getPerfisByUsuarioIdAndEmpresaId(usuarioId!, empresaId!),
		enabled: !!empresaId && !!usuarioId
	});
};

export const usePerfisByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['perfis', 'empresas', empresaId],
		queryFn: async () => getPerfisByEmpresaId(empresaId!),
		enabled: !!empresaId,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};

export const usePerfisAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['perfis', 'empresas', empresaId, 'admin'],
		queryFn: async () => getPerfisAdminByEmpresaId(empresaId!),
		enabled: !!empresaId,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};

export const usePerfilAdminByEmpresaIdAndPerfilIdQuery = (empresaId?: number, perfilId?: number) => {

	return useQuery({
		queryKey: ['perfis', 'empresas', empresaId, perfilId, 'admin'],
		queryFn: async () => getPerfilAdminByEmpresaIdAndPerfilId(empresaId!, perfilId!),
		enabled: !!perfilId && !!empresaId
	});
};
