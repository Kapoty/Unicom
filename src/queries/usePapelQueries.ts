import { useQuery } from '@tanstack/react-query';
import { getPapelById, getPapeis } from '../services/papelService';
import useAppStore from '../state/useAppStore';
import { usePerfilAtualQuery } from './usePerfilQueries';

export const usePapelQuery = (papelId?: number) => {

	return useQuery({
		queryKey: ['papeis', papelId],
		queryFn: async () => getPapelById(papelId!),
		enabled: !!papelId
	});
};

export const usePapelAtualQuery = () => {

	const {data: perfil} = usePerfilAtualQuery();

	return useQuery({
		queryKey: ['papeis', 'perfis', perfil?.perfilId],
		queryFn: async () => getPapelById(perfil?.papelId!),
		enabled: !!perfil
	});
};