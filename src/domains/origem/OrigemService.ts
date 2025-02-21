import api from '../../shared/utils/api';
import { IOrigem, IOrigemAdmin, OrigemAdminSchema, OrigemSchema } from './Origem';
import { OrigemPatchRequest, OrigemPostRequest } from './OrigemPayloads';

export const getOrigensByEmpresaId = async (empresaId: number): Promise<IOrigem[]> =>
    (await api.get<IOrigem[]>(`/origens/empresas/${empresaId}`)).data.map(origem => OrigemAdminSchema.parse(origem));

export const getOrigensAdminByEmpresaId = async (empresaId: number): Promise<IOrigemAdmin[]> =>
    (await api.get<IOrigemAdmin[]>(`/origens/empresas/${empresaId}/admin`)).data.map(origem => OrigemAdminSchema.parse(origem));

export const getOrigemByEmpresaIdAndOrigemId = async (empresaId: number, origemId: number): Promise<IOrigem> =>
    OrigemSchema.parse((await api.get<IOrigem>(`/origens/empresas/${empresaId}/${origemId}`)).data);

export const getOrigemAdminByEmpresaIdAndOrigemId = async (empresaId: number, origemId: number): Promise<IOrigemAdmin> =>
    OrigemAdminSchema.parse((await api.get<IOrigemAdmin>(`/origens/empresas/${empresaId}/${origemId}/admin`)).data);

export const postOrigem = async (empresaId: number, payload: OrigemPostRequest) =>
	OrigemAdminSchema.parse((await api.post<IOrigemAdmin>(`/origens/empresas/${empresaId}`, payload)).data);

export const patchOrigem = async (empresaId: number, origemId: number, payload: OrigemPatchRequest) =>
	OrigemAdminSchema.parse((await api.patch<IOrigemAdmin>(`/origens/empresas/${empresaId}/${origemId}`, payload)).data);

export const deleteOrigem = async (empresaId: number, origemId: number) =>
	await api.delete<void>(`/origens/empresas/${empresaId}/${origemId}`);