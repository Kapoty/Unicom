import { useQuery } from '@tanstack/react-query';
import { getRelatorioByEmpresaIdAndRelatorioId, getRelatorioByEmpresaIdAndUriQuery, getRelatoriosByEmpresaId, getRelatoriosByPerfilId } from './RelatorioService';

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

export const useRelatoriosByEmpresaIdQuery = (empresaId?: number, enabled = true) => {

	return useQuery({
		queryKey: ['relatorios', 'empresas', empresaId],
		queryFn: async () => getRelatoriosByEmpresaId(empresaId!),
		enabled: !!empresaId && enabled
	});
};

export const useRelatorioByEmpresaIdAndRelatorioIdQuery = (empresaId?: number, relatorioId?: number) => {

	return useQuery({
		queryKey: ['relatorios', 'empresas', empresaId, relatorioId],
		queryFn: async () => getRelatorioByEmpresaIdAndRelatorioId(empresaId!, relatorioId!),
		enabled: !!empresaId && !!relatorioId
	});
};