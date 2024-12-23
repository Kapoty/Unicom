import { DatagridVisaoAtualSchema, IDatagridVisaoAtual } from './DatagridVisaoAtual';
import api from '../../shared/utils/api';
import { DatagridVisaoAtualMarcarRequest } from './DatagridVisaoAtualPayloads';

export const getDatagridVisaoAtualByDatagrid = async (datagrid: string): Promise<IDatagridVisaoAtual> =>
	(DatagridVisaoAtualSchema.parse((await api.get<IDatagridVisaoAtual>(`/datagrids-visoes-atuais/datagrid/${datagrid}`)).data));

export const marcarDatagridVisaoAtualByDatagrid = async (datagrid: string, payload: DatagridVisaoAtualMarcarRequest): Promise<void> =>
	(await api.post(`/datagrids-visoes-atuais/datagrid/${datagrid}`, payload));