import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { EquipePatchRequest, EquipePostRequest } from "./EquipePayloads";
import { deleteEquipe, patchEquipe, postEquipe } from "./EquipeService";

export const useEquipePostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: EquipePostRequest }) =>
			postEquipe(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['equipes', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useEquipePatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, equipeId: number, payload: EquipePatchRequest }) =>
			patchEquipe(variables.empresaId, variables.equipeId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['equipes', 'empresas', variables.empresaId, variables.equipeId]
			});
		},
	})
}

export const useEquipeDeleteMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, equipeId: number }) =>
			deleteEquipe(variables.empresaId, variables.equipeId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['equipes', 'empresas', variables.empresaId]
			});
		},
	})
}