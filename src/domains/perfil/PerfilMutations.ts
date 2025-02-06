import { useMutation } from "@tanstack/react-query";
import { aceitarPerfil, alterarEquipe, patchPerfil, postPerfil, recusarPerfil } from "./PerfilService";
import queryClient from "../../shared/utils/queryClient";
import { PerfilAdminPatchRequest, PerfilAdminPostRequest, PerfilAlterarEquipeRequest } from "./PerfilPayloads";

export const usePerfilAceitarMutation = () => {
	return useMutation({
		mutationFn: async (variables: { perfilId: number }) =>
			aceitarPerfil(variables.perfilId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['perfis', variables.perfilId]
			});
		},
	})
}

export const usePerfilRecusarMutation = () => {
	return useMutation({
		mutationFn: async (variables: { perfilId: number }) =>
			recusarPerfil(variables.perfilId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['perfis', variables.perfilId]
			});
		},
	})
}

export const usePerfilPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: PerfilAdminPostRequest }) =>
			postPerfil(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['perfis', 'empresas', variables.empresaId]
			});
		},
	})
}

export const usePerfilPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, perfilId: number, payload: PerfilAdminPatchRequest }) =>
			patchPerfil(variables.empresaId, variables.perfilId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['perfis', 'empresas', variables.empresaId, variables.perfilId]
			});
		},
	})
}

export const usePerfilAlterarEquipeMutation = () => {
	return useMutation({
		mutationFn: async (variables: {perfilId: number, payload: PerfilAlterarEquipeRequest }) =>
			alterarEquipe(variables.perfilId, variables.payload),
	})
}