import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { BancoPatchRequest, BancoPostRequest } from "./BancoPayloads";
import { deleteBanco, patchBanco, postBanco } from "./BancoService";

export const useBancoPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {payload: BancoPostRequest }) =>
			postBanco(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['bancos']
			});
		},
	})
}

export const useBancoPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {bancoId: number, payload: BancoPatchRequest }) =>
			patchBanco(variables.bancoId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['bancos', variables.bancoId]
			});
		},
	})
}

export const useBancoDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { bancoId: number }) =>
			deleteBanco(variables.bancoId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['bancos']
			});
		},
	})
}