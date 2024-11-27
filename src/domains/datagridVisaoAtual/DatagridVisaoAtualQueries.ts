import { useQuery } from '@tanstack/react-query';
import { getDatagridVisaoAtualByDatagrid } from './DatagridVisaoAtualService';

export const useDatagridVisaoAtualByDatagridQuery = (datagrid?: string) => {
	return useQuery({
		queryKey: ['datagrid-visao-atual', 'datagrid', datagrid],
		queryFn: async () => getDatagridVisaoAtualByDatagrid(datagrid!),
		enabled: !!datagrid,
		retry: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
};