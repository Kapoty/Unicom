import { useQuery } from '@tanstack/react-query';
import { getPerfilById, getPerfilByUsuarioIdAndEmpresaId } from '../services/perfilService';
import { useUsuarioLogadoQuery } from './useUsuarioQueries';
import useAppStore from '../state/useAppStore';

export const usePerfilQuery = (perfilId?: number) => {

	return useQuery({
		queryKey: ['perfil', perfilId],
		queryFn: async () => getPerfilById(perfilId!),
		enabled: !!perfilId
	});
};

export const usePerfilAtualQuery = () => {

	const {data: usuario} = useUsuarioLogadoQuery();
	const empresa = useAppStore(s => s.empresa);
	const empresaId = empresa?.empresaId || usuario?.empresaPrincipalId;

	return useQuery({
		queryKey: ['perfil', 'usuarios', usuario?.usuarioId, 'empresas', empresaId],
		queryFn: async () => getPerfilByUsuarioIdAndEmpresaId(usuario!.usuarioId, empresaId!),
		enabled: !!usuario && !!empresaId
	});
};