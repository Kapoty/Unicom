import { useQuery } from '@tanstack/react-query';
import { getRelatorioByEmpresaIdAndUriQuery, getRelatoriosByPerfilId } from './RelatorioService';

export const useRelatoriosByPerfilQuery = (perfilId?: number) => {

	return useQuery({
		queryKey: ['relatorios', 'perfis', perfilId],
		queryFn: async () => getRelatoriosByPerfilId(perfilId!),
		enabled: !!perfilId
	});
};

export const useRelatorioByEmpresaIdAndUriQuery = (empresaId?: number, uri?: string) => {

	return useQuery({
		queryKey: ['relatorios', 'empresas', empresaId, 'uri', uri],
		queryFn: async () => getRelatorioByEmpresaIdAndUriQuery(empresaId!, uri!),
		enabled: !!empresaId && !!uri
	});
};