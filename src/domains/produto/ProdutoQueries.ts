import { useQuery } from '@tanstack/react-query';
import { getProdutoAdminByEmpresaIdAndProdutoId, getProdutoByEmpresaIdAndProdutoId, getProdutosAdminByEmpresaId, getProdutosByEmpresaId } from './ProdutoService';

export const useProdutosByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['produtos', 'empresas', empresaId],
		queryFn: async () => getProdutosByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useProdutosAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['produtos', 'empresas', empresaId, 'admin'],
		queryFn: async () => getProdutosAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useProdutoByEmpresaIdAndProdutoIdQuery = (empresaId?: number, produtoId?: number) => {

	return useQuery({
		queryKey: ['produtos', 'empresas', empresaId, produtoId],
		queryFn: async () => getProdutoByEmpresaIdAndProdutoId(empresaId!, produtoId!),
		enabled: !!empresaId && !!produtoId
	});
};

export const useProdutoAdminByEmpresaIdAndProdutoIdQuery = (empresaId?: number, produtoId?: number) => {

	return useQuery({
		queryKey: ['produtos', 'empresas', empresaId, produtoId, 'admin'],
		queryFn: async () => getProdutoAdminByEmpresaIdAndProdutoId(empresaId!, produtoId!),
		enabled: !!empresaId && !!produtoId
	});
};