import { useMutation } from "@tanstack/react-query";
import { deleteByUsuarioIdAndFileId, trashByUsuarioIdAndFileId, untrashByUsuarioIdAndFileId, uploadByUsuarioId } from "./AnexoService";
import queryClient from "../../shared/utils/queryClient";

export const useAnexoUploadByUsuarioIdMutation = () => {
	return useMutation({
		mutationFn: async (variables: { usuarioId: number, file: File }) =>
			uploadByUsuarioId(variables.usuarioId, variables.file),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['anexos', 'usuarios', variables.usuarioId]
			});
		},
	})
}

export const useAnexoTrashByUsuarioIdAndFileIdMutation = () => {
	return useMutation({
		mutationFn: async (variables: { usuarioId: number, fileId: string }) =>
			trashByUsuarioIdAndFileId(variables.usuarioId, variables.fileId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['anexos', 'usuarios', variables.usuarioId]
			});
		},
	})
}

export const useAnexoUntrashByUsuarioIdAndFileIdMutation = () => {
	return useMutation({
		mutationFn: async (variables: { usuarioId: number, fileId: string }) =>
			untrashByUsuarioIdAndFileId(variables.usuarioId, variables.fileId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['anexos', 'usuarios', variables.usuarioId]
			});
		},
	})
}

export const useAnexoDeleteByUsuarioIdAndFileIdMutation = () => {
	return useMutation({
		mutationFn: async (variables: { usuarioId: number, fileId: string }) =>
			deleteByUsuarioIdAndFileId(variables.usuarioId, variables.fileId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['anexos', 'usuarios', variables.usuarioId]
			});
		},
	})
}