import { useQuery } from '@tanstack/react-query';
import { getPerfilById, getPerfilByUsuarioIdAndEmpresaId } from '../services/perfilService';
import { useUsuarioLogadoQuery } from './useUsuarioQueries';
import useAppStore from '../state/useAppStore';
import useEmpresaIdParam from '../hooks/params/useEmpresaIdParam';

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