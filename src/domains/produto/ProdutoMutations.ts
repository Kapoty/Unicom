import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { ProdutoPatchRequest, ProdutoPostRequest } from "./ProdutoPayloads";
import { deleteProduto, patchProduto, postProduto } from "./ProdutoService";

export const useProdutoPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: ProdutoPostRequest }) =>
			postProduto(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['produtos', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useProdutoPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, produtoId: number, payload: ProdutoPatchRequest }) =>
			patchProduto(variables.empresaId, variables.produtoId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['produtos', 'empresas', variables.empresaId, variables.produtoId]
			});
		},
	})
}

export const useProdutoDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, produtoId: number }) =>
			deleteProduto(variables.empresaId, variables.produtoId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['produtos', 'empresas', variables.empresaId]
			});
		},
	})
}