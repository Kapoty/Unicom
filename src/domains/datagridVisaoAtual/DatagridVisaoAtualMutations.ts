import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { MarcarDatagridVisaoAtualRequest } from "./DatagridVisaoAtualPayloads";
import { marcarDatagridVisaoAtualByDatagrid } from "./DatagridVisaoAtualService";

export const useMarcarDatagridVisaoAtualMutation = () => {
	return useMutation({
		mutationFn: async (variables: { datagrid: string, payload: MarcarDatagridVisaoAtualRequest }) =>
			marcarDatagridVisaoAtualByDatagrid(variables.datagrid, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['datagrid-visao-atual', 'datagrid', variables.datagrid]
			});
		},
	})
}