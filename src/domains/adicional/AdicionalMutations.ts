import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { AdicionalPatchRequest, AdicionalPostRequest } from "./AdicionalPayloads";
import { deleteAdicional, patchAdicional, postAdicional } from "./AdicionalService";

export const useAdicionalPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: AdicionalPostRequest }) =>
			postAdicional(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['adicionais', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useAdicionalPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, adicionalId: number, payload: AdicionalPatchRequest }) =>
			patchAdicional(variables.empresaId, variables.adicionalId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['adicionais', 'empresas', variables.empresaId, variables.adicionalId]
			});
		},
	})
}

export const useAdicionalDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, adicionalId: number }) =>
			deleteAdicional(variables.empresaId, variables.adicionalId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['adicionais', 'empresas', variables.empresaId]
			});
		},
	})
}