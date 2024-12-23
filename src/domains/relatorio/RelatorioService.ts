import { IRelatorio, IRelatorioAdmin, RelatorioAdminSchema, RelatorioSchema} from './Relatorio';
import api from '../../shared/utils/api';
import { RelatorioPatchRequest, RelatorioPostRequest } from './RelatorioPayloads';

export const getRelatoriosByPerfilId = async (perfilId: number): Promise<IRelatorio[]> =>
    (await api.get<IRelatorio[]>(`/relatorios/perfis/${perfilId}`)).data.map(relatorio => RelatorioSchema.parse(relatorio));

export const getRelatorioByEmpresaIdAndUriQuery = async (empresaId: number, uri: string): Promise<IRelatorio> =>
    RelatorioSchema.parse((await api.get<IRelatorio>(`/relatorios/empresas/${empresaId}/uri/${uri}`)).data);

export const getRelatoriosByEmpresaId = async (empresaId: number): Promise<IRelatorioAdmin[]> =>
    (await api.get<IRelatorioAdmin[]>(`/relatorios/empresas/${empresaId}`)).data.map(relatorio => RelatorioAdminSchema.parse(relatorio));

export const getRelatorioByEmpresaIdAndRelatorioId = async (empresaId: number, relatorioId: number): Promise<IRelatorioAdmin> =>
    RelatorioAdminSchema.parse((await api.get<IRelatorioAdmin>(`/relatorios/empresas/${empresaId}/${relatorioId}`)).data);

export const postRelatorio = async (empresaId: number, payload: RelatorioPostRequest) =>
	RelatorioAdminSchema.parse((await api.post<IRelatorioAdmin>(`/relatorios/empresas/${empresaId}`, payload)).data);

export const patchRelatorio = async (empresaId: number, relatorioId: number, payload: RelatorioPatchRequest) =>
	RelatorioAdminSchema.parse((await api.patch<IRelatorioAdmin>(`/relatorios/empresas/${empresaId}/${relatorioId}`, payload)).data);

export const deleteRelatorio = async (empresaId: number, relatorioId: number) =>
	await api.delete<void>(`/relatorios/empresas/${empresaId}/${relatorioId}`);