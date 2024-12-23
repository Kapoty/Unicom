import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { RelatorioPatchRequest, RelatorioPostRequest } from "./RelatorioPayloads";
import { deleteRelatorio, patchRelatorio, postRelatorio } from "./RelatorioService";

export const useRelatorioPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: RelatorioPostRequest }) =>
			postRelatorio(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['relatorios', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useRelatorioPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, relatorioId: number, payload: RelatorioPatchRequest }) =>
			patchRelatorio(variables.empresaId, variables.relatorioId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['relatorios', 'empresas', variables.empresaId, variables.relatorioId]
			});
		},
	})
}

export const useRelatorioDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, relatorioId: number }) =>
			deleteRelatorio(variables.empresaId, variables.relatorioId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['relatorios', 'empresas', variables.empresaId]
			});
		},
	})
}