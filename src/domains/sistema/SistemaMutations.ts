import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { SistemaPatchRequest, SistemaPostRequest } from "./SistemaPayloads";
import { deleteSistema, patchSistema, postSistema } from "./SistemaService";

export const useSistemaPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: SistemaPostRequest }) =>
			postSistema(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['sistemas', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useSistemaPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, sistemaId: number, payload: SistemaPatchRequest }) =>
			patchSistema(variables.empresaId, variables.sistemaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['sistemas', 'empresas', variables.empresaId, variables.sistemaId]
			});
		},
	})
}

export const useSistemaDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, sistemaId: number }) =>
			deleteSistema(variables.empresaId, variables.sistemaId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['sistemas', 'empresas', variables.empresaId]
			});
		},
	})
}