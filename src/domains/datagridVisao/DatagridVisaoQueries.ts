import { useQuery } from '@tanstack/react-query';
import { getDatagridsVisoesByDatagrid } from './DatagridVisaoService';

export const useDatagridsVisoesByDatagridQuery = (datagrid?: string) => {
  return useQuery({
    queryKey: ['datagrids-visoes', 'datagrid', datagrid],
    queryFn: async () => getDatagridsVisoesByDatagrid(datagrid!),
	enabled: !!datagrid,
  });
};