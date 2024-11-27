import { useQuery } from '@tanstack/react-query';
import { useUsuarioLogadoQuery } from '../usuario/UsuarioQueries';
import useEmpresaIdParam from '../../shared/hooks/useEmpresaIdParam';
import { getPerfilById, getPerfilByUsuarioIdAndEmpresaId } from './PerfilService';

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