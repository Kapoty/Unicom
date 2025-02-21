import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { OrigemPatchRequest, OrigemPostRequest } from "./OrigemPayloads";
import { deleteOrigem, patchOrigem, postOrigem } from "./OrigemService";

export const useOrigemPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: OrigemPostRequest }) =>
			postOrigem(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['origens', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useOrigemPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, origemId: number, payload: OrigemPatchRequest }) =>
			patchOrigem(variables.empresaId, variables.origemId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['origens', 'empresas', variables.empresaId, variables.origemId]
			});
		},
	})
}

export const useOrigemDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, origemId: number }) =>
			deleteOrigem(variables.empresaId, variables.origemId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['origens', 'empresas', variables.empresaId]
			});
		},
	})
}