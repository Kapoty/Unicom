import { DatagridVisaoAtualSchema, IDatagridVisaoAtual, MarcarDatagridVisaoAtualRequest } from './DatagridVisaoAtual';
import api from '../../shared/utils/api';

export const getDatagridVisaoAtualByDatagrid = async (datagrid: string): Promise<IDatagridVisaoAtual> =>
	(DatagridVisaoAtualSchema.parse((await api.get<IDatagridVisaoAtual>(`/datagrids-visoes-atuais/datagrid/${datagrid}`)).data));

export const marcarDatagridVisaoAtualByDatagrid = async (datagrid: string, payload: MarcarDatagridVisaoAtualRequest): Promise<void> =>
	(await api.post(`/datagrids-visoes-atuais/datagrid/${datagrid}`, payload));