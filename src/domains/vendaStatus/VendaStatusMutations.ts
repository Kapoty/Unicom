import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { VendaStatusPatchRequest, VendaStatusPostRequest } from "./VendaStatusPayloads";
import { deleteVendaStatus, patchVendaStatus, postVendaStatus } from "./VendaStatusService";

export const useVendaStatusPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: VendaStatusPostRequest }) =>
			postVendaStatus(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['venda-status', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useVendaStatusPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, vendaStatusId: number, payload: VendaStatusPatchRequest }) =>
			patchVendaStatus(variables.empresaId, variables.vendaStatusId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['venda-status', 'empresas', variables.empresaId, variables.vendaStatusId]
			});
		},
	})
}

export const useVendaStatusDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, vendaStatusId: number }) =>
			deleteVendaStatus(variables.empresaId, variables.vendaStatusId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['venda-status', 'empresas', variables.empresaId]
			});
		},
	})
}