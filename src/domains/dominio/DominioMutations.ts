import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { DominioPatchRequest, DominioPostRequest } from "./DominioPayloads";
import { deleteDominio, patchDominio, postDominio } from "./DominioService";

export const useDominioPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: { payload: DominioPostRequest }) =>
			postDominio(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['grupos']
			});
		},
	})
}

export const useDominioPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: { dominioId: number, payload: DominioPatchRequest }) =>
			patchDominio(variables.dominioId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['dominios', variables.dominioId]
			});
		},
	})
}

export const useDominioDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { dominioId: number }) =>
			deleteDominio(variables.dominioId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['dominios']
			});
		},
	})
}