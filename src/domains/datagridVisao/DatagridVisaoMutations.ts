import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { useDatagridVisaoAtualMarcarMutation } from "../datagridVisaoAtual/DatagridVisaoAtualMutations";
import { DatagridVisaoPatchRequest, DatagridVisaoPostRequest } from "./DatagridVisao";
import { deleteDatagridVisaoByDatagridVisaoId, patchDatagridVisaoByDatagridVisaoId, postDatagridVisaoByDatagrid } from "./DatagridVisaoService";

export const usePostDatagridVisaoMutation = () => {

	const { mutate: marcarDatagridVisaoAtual } = useDatagridVisaoAtualMarcarMutation();

	return useMutation({
		mutationFn: async (variables: { datagrid: string, payload: DatagridVisaoPostRequest }) =>
			postDatagridVisaoByDatagrid(variables.datagrid, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['datagrids-visoes', 'datagrid', variables.datagrid]
			});

			marcarDatagridVisaoAtual({
				datagrid: variables.datagrid,
				payload: {
					tipo: 'PERSONALIZADA',
					datagridVisaoId: data.datagridVisaoId
				}
			});
		}
	})
}

export const usePatchDatagridVisaoMutation = () => {

	return useMutation({
		mutationFn: async (variables: { datagrid: string, datagridVisaoId: number, payload: DatagridVisaoPatchRequest }) =>
			patchDatagridVisaoByDatagridVisaoId(variables.datagridVisaoId, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['datagrids-visoes', 'datagrid', variables.datagrid]
			});
		}
	})
}

export const useDeleteDatagridVisaoMutation = () => {

	return useMutation({
		mutationFn: async (variables: { datagrid: string, datagridVisaoId: number}) =>
			deleteDatagridVisaoByDatagridVisaoId(variables.datagridVisaoId),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['datagrids-visoes', 'datagrid', variables.datagrid]
			});
		},
	})
}