import api from '../../shared/utils/api';
import { ISistema, ISistemaAdmin, SistemaAdminSchema, SistemaSchema } from './Sistema';
import { SistemaPatchRequest, SistemaPostRequest } from './SistemaPayloads';

export const getSistemasByEmpresaId = async (empresaId: number): Promise<ISistema[]> =>
    (await api.get<ISistema[]>(`/sistemas/empresas/${empresaId}`)).data.map(sistema => SistemaAdminSchema.parse(sistema));

export const getSistemasAdminByEmpresaId = async (empresaId: number): Promise<ISistemaAdmin[]> =>
    (await api.get<ISistemaAdmin[]>(`/sistemas/empresas/${empresaId}/admin`)).data.map(sistema => SistemaAdminSchema.parse(sistema));

export const getSistemaByEmpresaIdAndSistemaId = async (empresaId: number, sistemaId: number): Promise<ISistema> =>
    SistemaSchema.parse((await api.get<ISistema>(`/sistemas/empresas/${empresaId}/${sistemaId}`)).data);

export const getSistemaAdminByEmpresaIdAndSistemaId = async (empresaId: number, sistemaId: number): Promise<ISistemaAdmin> =>
    SistemaAdminSchema.parse((await api.get<ISistemaAdmin>(`/sistemas/empresas/${empresaId}/${sistemaId}/admin`)).data);

export const postSistema = async (empresaId: number, payload: SistemaPostRequest) =>
	SistemaAdminSchema.parse((await api.post<ISistemaAdmin>(`/sistemas/empresas/${empresaId}`, payload)).data);

export const patchSistema = async (empresaId: number, sistemaId: number, payload: SistemaPatchRequest) =>
	SistemaAdminSchema.parse((await api.patch<ISistemaAdmin>(`/sistemas/empresas/${empresaId}/${sistemaId}`, payload)).data);

export const deleteSistema = async (empresaId: number, sistemaId: number) =>
	await api.delete<void>(`/sistemas/empresas/${empresaId}/${sistemaId}`);