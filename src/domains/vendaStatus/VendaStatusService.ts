import api from '../../shared/utils/api';
import { IVendaStatus, IVendaStatusAdmin, VendaStatusAdminSchema, VendaStatusSchema } from './VendaStatus';
import { VendaStatusPatchRequest, VendaStatusPostRequest } from './VendaStatusPayloads';

export const getVendaStatusByEmpresaId = async (empresaId: number): Promise<IVendaStatus[]> =>
    (await api.get<IVendaStatus[]>(`/venda-status/empresas/${empresaId}`)).data.map(vendaStatus => VendaStatusAdminSchema.parse(vendaStatus));

export const getVendaStatusAdminByEmpresaId = async (empresaId: number): Promise<IVendaStatusAdmin[]> =>
    (await api.get<IVendaStatusAdmin[]>(`/venda-status/empresas/${empresaId}/admin`)).data.map(vendaStatus => VendaStatusAdminSchema.parse(vendaStatus));

export const getVendaStatusByEmpresaIdAndVendaStatusId = async (empresaId: number, vendaStatusId: number): Promise<IVendaStatus> =>
    VendaStatusSchema.parse((await api.get<IVendaStatus>(`/venda-status/empresas/${empresaId}/${vendaStatusId}`)).data);

export const getVendaStatusAdminByEmpresaIdAndVendaStatusId = async (empresaId: number, vendaStatusId: number): Promise<IVendaStatusAdmin> =>
    VendaStatusAdminSchema.parse((await api.get<IVendaStatusAdmin>(`/venda-status/empresas/${empresaId}/${vendaStatusId}/admin`)).data);

export const postVendaStatus = async (empresaId: number, payload: VendaStatusPostRequest) =>
	VendaStatusAdminSchema.parse((await api.post<IVendaStatusAdmin>(`/venda-status/empresas/${empresaId}`, payload)).data);

export const patchVendaStatus = async (empresaId: number, vendaStatusId: number, payload: VendaStatusPatchRequest) =>
	VendaStatusAdminSchema.parse((await api.patch<IVendaStatusAdmin>(`/venda-status/empresas/${empresaId}/${vendaStatusId}`, payload)).data);

export const deleteVendaStatus = async (empresaId: number, vendaStatusId: number) =>
	await api.delete<void>(`/venda-status/empresas/${empresaId}/${vendaStatusId}`);