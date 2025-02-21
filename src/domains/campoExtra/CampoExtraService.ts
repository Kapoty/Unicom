import api from '../../shared/utils/api';
import { CampoExtraAdminSchema, CampoExtraSchema, ICampoExtra, ICampoExtraAdmin } from './CampoExtra';
import { CampoExtraPatchRequest, CampoExtraPostRequest } from './CampoExtraPayloads';

export const getCamposExtrasByEmpresaId = async (empresaId: number): Promise<ICampoExtra[]> =>
    (await api.get<ICampoExtra[]>(`/campos-extras/empresas/${empresaId}`)).data.map(campoExtra => CampoExtraAdminSchema.parse(campoExtra));

export const getCamposExtrasAdminByEmpresaId = async (empresaId: number): Promise<ICampoExtraAdmin[]> =>
    (await api.get<ICampoExtraAdmin[]>(`/campos-extras/empresas/${empresaId}/admin`)).data.map(campoExtra => CampoExtraAdminSchema.parse(campoExtra));

export const getCampoExtraByEmpresaIdAndCampoExtraSlot = async (empresaId: number, campoExtraSlot: string): Promise<ICampoExtra> =>
    CampoExtraSchema.parse((await api.get<ICampoExtra>(`/campos-extras/empresas/${empresaId}/${campoExtraSlot}`)).data);

export const getCampoExtraAdminByEmpresaIdAndCampoExtraSlot = async (empresaId: number, campoExtraSlot: string): Promise<ICampoExtraAdmin> =>
    CampoExtraAdminSchema.parse((await api.get<ICampoExtraAdmin>(`/campos-extras/empresas/${empresaId}/${campoExtraSlot}/admin`)).data);

export const postCampoExtra = async (empresaId: number, payload: CampoExtraPostRequest) =>
	CampoExtraAdminSchema.parse((await api.post<ICampoExtraAdmin>(`/campos-extras/empresas/${empresaId}`, payload)).data);

export const patchCampoExtra = async (empresaId: number, campoExtraSlot: string, payload: CampoExtraPatchRequest) =>
	CampoExtraAdminSchema.parse((await api.patch<ICampoExtraAdmin>(`/campos-extras/empresas/${empresaId}/${campoExtraSlot}`, payload)).data);

export const deleteCampoExtra = async (empresaId: number, campoExtraSlot: string) =>
	await api.delete<void>(`/campos-extras/empresas/${empresaId}/${campoExtraSlot}`);