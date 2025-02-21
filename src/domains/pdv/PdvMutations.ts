import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { PdvPatchRequest, PdvPostRequest } from "./PdvPayloads";
import { deletePdv, patchPdv, postPdv } from "./PdvService";

export const usePdvPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: PdvPostRequest }) =>
			postPdv(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['pdvs', 'empresas', variables.empresaId]
			});
		},
	})
}

export const usePdvPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, pdvId: number, payload: PdvPatchRequest }) =>
			patchPdv(variables.empresaId, variables.pdvId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['pdvs', 'empresas', variables.empresaId, variables.pdvId]
			});
		},
	})
}

export const usePdvDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, pdvId: number }) =>
			deletePdv(variables.empresaId, variables.pdvId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['pdvs', 'empresas', variables.empresaId]
			});
		},
	})
}