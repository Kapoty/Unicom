import { useMutation } from "@tanstack/react-query";
import queryClient from "../../shared/utils/queryClient";
import { DatagridVisaoAtualMarcarRequest } from "./DatagridVisaoAtualPayloads";
import { marcarDatagridVisaoAtualByDatagrid } from "./DatagridVisaoAtualService";

export const useDatagridVisaoAtualMarcarMutation = () => {
	return useMutation({
		mutationFn: async (variables: { datagrid: string, payload: DatagridVisaoAtualMarcarRequest }) =>
			marcarDatagridVisaoAtualByDatagrid(variables.datagrid, variables.payload),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['datagrid-visao-atual', 'datagrid', variables.datagrid]
			});
		},
	})
}