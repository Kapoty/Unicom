import api from '../../shared/utils/api';
import { IBanco, IBancoAdmin, BancoAdminSchema, BancoSchema } from './Banco';
import { BancoPatchRequest, BancoPostRequest } from './BancoPayloads';

export const getBancos = async (): Promise<IBanco[]> =>
    (await api.get<IBanco[]>(`/bancos`)).data.map(banco => BancoAdminSchema.parse(banco));

export const getBancosAdmin = async (): Promise<IBancoAdmin[]> =>
    (await api.get<IBancoAdmin[]>(`/bancos/admin`)).data.map(banco => BancoAdminSchema.parse(banco));

export const getBancoByBancoId = async (bancoId: number): Promise<IBanco> =>
    BancoSchema.parse((await api.get<IBanco>(`/bancos/${bancoId}`)).data);

export const getBancoAdminByBancoId = async (bancoId: number): Promise<IBancoAdmin> =>
    BancoAdminSchema.parse((await api.get<IBancoAdmin>(`/bancos/${bancoId}/admin`)).data);

export const postBanco = async (payload: BancoPostRequest) =>
	BancoAdminSchema.parse((await api.post<IBancoAdmin>(`/bancos`, payload)).data);

export const patchBanco = async (bancoId: number, payload: BancoPatchRequest) =>
	BancoAdminSchema.parse((await api.patch<IBancoAdmin>(`/bancos/${bancoId}`, payload)).data);

export const deleteBanco = async (bancoId: number) =>
	await api.delete<void>(`/bancos/${bancoId}`);