import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { CampoExtraPatchRequest, CampoExtraPostRequest } from "./CampoExtraPayloads";
import { deleteCampoExtra, patchCampoExtra, postCampoExtra } from "./CampoExtraService";

export const useCampoExtraPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: CampoExtraPostRequest }) =>
			postCampoExtra(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['campos-extras', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useCampoExtraPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, campoExtraSlot: string, payload: CampoExtraPatchRequest }) =>
			patchCampoExtra(variables.empresaId, variables.campoExtraSlot, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['campos-extras', 'empresas', variables.empresaId, variables.campoExtraSlot]
			});
		},
	})
}

export const useCampoExtraDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, campoExtraSlot: string }) =>
			deleteCampoExtra(variables.empresaId, variables.campoExtraSlot),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['campos-extras', 'empresas', variables.empresaId]
			});
		},
	})
}