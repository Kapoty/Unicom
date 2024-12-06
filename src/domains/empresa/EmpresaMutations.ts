import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { PatchEmpresaAdminRequest, PostEmpresaAdminRequest } from "./EmpresaPayloads";
import { patchEmpresaAdmin, postEmpresaAdmin } from "./EmpresaService";

export const usePostEmpresaAdminMutation = () => {
	return useMutation({
		mutationFn: async (variables: { payload: PostEmpresaAdminRequest }) =>
			postEmpresaAdmin(variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['empresas', 'admin']
			});
		},
	})
}

export const usePatchEmpresaAdminMutation = () => {
	return useMutation({
		mutationFn: async (variables: { empresaId: number, payload: PatchEmpresaAdminRequest }) =>
			patchEmpresaAdmin(variables.empresaId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['empresas', variables.empresaId, 'admin']
			});
		},
	})
}