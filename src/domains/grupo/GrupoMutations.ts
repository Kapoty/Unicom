import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { GrupoPatchRequest, GrupoPostRequest } from "./GrupoPayloads";
import { patchGrupo, postGrupo } from "./GrupoService";

export const useGrupoPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: { payload: GrupoPostRequest }) =>
			postGrupo(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['grupos']
			});
		},
	})
}

export const useGrupoPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: { grupoId: number, payload: GrupoPatchRequest }) =>
			patchGrupo(variables.grupoId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['grupos', variables.grupoId]
			});
		},
	})
}