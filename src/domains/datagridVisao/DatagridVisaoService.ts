import { APItoModelConverter, DatagridVisaoPatchRequest, DatagridVisaoPostRequest, IDatagridVisao, IDatagridVisaoAPI } from './DatagridVisao';
import api from '../../shared/utils/api';

export const getDatagridsVisoesByDatagrid = async (datagrid: string) =>
	(await api.get<IDatagridVisaoAPI[]>(`/datagrids-visoes/datagrid/${datagrid}`)).data.map((d) => APItoModelConverter.parse(d));

export const postDatagridVisaoByDatagrid = async (datagrid: string, payload: DatagridVisaoPostRequest) =>
	(await api.post<IDatagridVisaoAPI>(`/datagrids-visoes/datagrid/${datagrid}`, payload)).data;

export const patchDatagridVisaoByDatagridVisaoId = async (datagridVisaoId: number, payload: DatagridVisaoPatchRequest) =>
	(await api.patch<void>(`/datagrids-visoes/${datagridVisaoId}`, payload));

export const deleteDatagridVisaoByDatagridVisaoId = async (datagridVisaoId: number) =>
	(await api.delete<void>(`/datagrids-visoes/${datagridVisaoId}`));