import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { UsuarioBuscarRequest, UsuarioMePatchRequest, UsuarioPatchRequest, UsuarioPostRequest } from "./UsuarioPayloads";
import { buscarUsuario, patchMe, patchUsuario, postUsuario } from "./UsuarioService";

export const useUsuarioPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, payload: UsuarioPostRequest }) =>
			postUsuario(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['usuarios', 'empresas', variables.empresaId]
			});
		},
	})
}

export const useUsuarioPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {empresaId: number, usuarioId: number, payload: UsuarioPatchRequest }) =>
			patchUsuario(variables.empresaId, variables.usuarioId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['usuarios', 'empresas', variables.empresaId, variables.usuarioId]
			});
		},
	})
}

export const useUsuarioBuscarMutation = () => {
	return useMutation({
		mutationFn: async (variables: {payload: UsuarioBuscarRequest }) =>
			buscarUsuario(variables.payload)
	})
}

export const useUsuarioMePatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: {payload: UsuarioMePatchRequest }) =>
			patchMe(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['usuarios', 'me']
			});
		},
	})
}