import api from '../../shared/utils/api';
import { IAdicional, IAdicionalAdmin, AdicionalAdminSchema, AdicionalSchema } from './Adicional';
import { AdicionalPatchRequest, AdicionalPostRequest } from './AdicionalPayloads';

export const getAdicionaisByEmpresaId = async (empresaId: number): Promise<IAdicional[]> =>
    (await api.get<IAdicional[]>(`/adicionais/empresas/${empresaId}`)).data.map(adicional => AdicionalAdminSchema.parse(adicional));

export const getAdicionaisAdminByEmpresaId = async (empresaId: number): Promise<IAdicionalAdmin[]> =>
    (await api.get<IAdicionalAdmin[]>(`/adicionais/empresas/${empresaId}/admin`)).data.map(adicional => AdicionalAdminSchema.parse(adicional));

export const getAdicionalByEmpresaIdAndAdicionalId = async (empresaId: number, adicionalId: number): Promise<IAdicional> =>
    AdicionalSchema.parse((await api.get<IAdicional>(`/adicionais/empresas/${empresaId}/${adicionalId}`)).data);

export const getAdicionalAdminByEmpresaIdAndAdicionalId = async (empresaId: number, adicionalId: number): Promise<IAdicionalAdmin> =>
    AdicionalAdminSchema.parse((await api.get<IAdicionalAdmin>(`/adicionais/empresas/${empresaId}/${adicionalId}/admin`)).data);

export const postAdicional = async (empresaId: number, payload: AdicionalPostRequest) =>
	AdicionalAdminSchema.parse((await api.post<IAdicionalAdmin>(`/adicionais/empresas/${empresaId}`, payload)).data);

export const patchAdicional = async (empresaId: number, adicionalId: number, payload: AdicionalPatchRequest) =>
	AdicionalAdminSchema.parse((await api.patch<IAdicionalAdmin>(`/adicionais/empresas/${empresaId}/${adicionalId}`, payload)).data);

export const deleteAdicional = async (empresaId: number, adicionalId: number) =>
	await api.delete<void>(`/adicionais/empresas/${empresaId}/${adicionalId}`);