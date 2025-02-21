import api from '../../shared/utils/api';
import { IPdv, IPdvAdmin, PdvAdminSchema, PdvSchema } from './Pdv';
import { PdvPatchRequest, PdvPostRequest } from './PdvPayloads';

export const getPdvsByEmpresaId = async (empresaId: number): Promise<IPdv[]> =>
    (await api.get<IPdv[]>(`/pdvs/empresas/${empresaId}`)).data.map(pdv => PdvAdminSchema.parse(pdv));

export const getPdvsAdminByEmpresaId = async (empresaId: number): Promise<IPdvAdmin[]> =>
    (await api.get<IPdvAdmin[]>(`/pdvs/empresas/${empresaId}/admin`)).data.map(pdv => PdvAdminSchema.parse(pdv));

export const getPdvByEmpresaIdAndPdvId = async (empresaId: number, pdvId: number): Promise<IPdv> =>
    PdvSchema.parse((await api.get<IPdv>(`/pdvs/empresas/${empresaId}/${pdvId}`)).data);

export const getPdvAdminByEmpresaIdAndPdvId = async (empresaId: number, pdvId: number): Promise<IPdvAdmin> =>
    PdvAdminSchema.parse((await api.get<IPdvAdmin>(`/pdvs/empresas/${empresaId}/${pdvId}/admin`)).data);

export const postPdv = async (empresaId: number, payload: PdvPostRequest) =>
	PdvAdminSchema.parse((await api.post<IPdvAdmin>(`/pdvs/empresas/${empresaId}`, payload)).data);

export const patchPdv = async (empresaId: number, pdvId: number, payload: PdvPatchRequest) =>
	PdvAdminSchema.parse((await api.patch<IPdvAdmin>(`/pdvs/empresas/${empresaId}/${pdvId}`, payload)).data);

export const deletePdv = async (empresaId: number, pdvId: number) =>
	await api.delete<void>(`/pdvs/empresas/${empresaId}/${pdvId}`);