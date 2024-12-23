import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { EmpresaAdminPatchRequest, EmpresaAdminPostRequest, EmpresaAparenciaPatchRequest } from "./EmpresaPayloads";
import { patchEmpresaAdmin, patchEmpresaAparencia, postEmpresaAdmin } from "./EmpresaService";

export const useEmpresaAdminPostMutation = () => {
	return useMutation({
		mutationFn: async (variables: { payload: EmpresaAdminPostRequest }) =>
			postEmpresaAdmin(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['empresas', 'admin']
			});
		},
	})
}

export const useEmpresaAdminPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, payload: EmpresaAdminPatchRequest }) =>
			patchEmpresaAdmin(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['empresas', variables.empresaId, 'admin']
			});
		},
	})
}

export const useEmpresaAparenciaPatchMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, payload: EmpresaAparenciaPatchRequest }) =>
			patchEmpresaAparencia(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['empresas', variables.empresaId]
			});
		},
	})
}