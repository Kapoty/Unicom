import api from '../../shared/utils/api';
import { EquipeAdminSchema, EquipeInfoSchema, EquipeSchema, IEquipe, IEquipeAdmin, IEquipeInfo } from './Equipe';
import { EquipePatchRequest, EquipePostRequest } from './EquipePayloads';
export const getEquipesByPerfilId = async (perfilId: number): Promise<IEquipe[]> =>
    (await api.get<IEquipe[]>(`/equipes/perfis/${perfilId}`)).data.map(equipe => EquipeSchema.parse(equipe));

export const getEquipesByEmpresaId = async (empresaId: number): Promise<IEquipeAdmin[]> =>
    (await api.get<IEquipeAdmin[]>(`/equipes/empresas/${empresaId}`)).data.map(equipe => EquipeAdminSchema.parse(equipe));

export const getEquipeByEmpresaIdAndEquipeId = async (empresaId: number, equipeId: number): Promise<IEquipe> =>
    EquipeSchema.parse((await api.get<IEquipe>(`/equipes/empresas/${empresaId}/${equipeId}`)).data);

export const getEquipeInfoByEmpresaIdAndEquipeId = async (empresaId: number, equipeId: number): Promise<IEquipeInfo> =>
    EquipeInfoSchema.parse((await api.get<IEquipeInfo>(`/equipes/empresas/${empresaId}/${equipeId}/info`)).data);

export const getEquipeAdminByEmpresaIdAndEquipeId = async (empresaId: number, equipeId: number): Promise<IEquipeAdmin> =>
    EquipeAdminSchema.parse((await api.get<IEquipeAdmin>(`/equipes/empresas/${empresaId}/${equipeId}/admin`)).data);

export const postEquipe = async (empresaId: number, payload: EquipePostRequest) =>
	EquipeAdminSchema.parse((await api.post<IEquipeAdmin>(`/equipes/empresas/${empresaId}`, payload)).data);

export const patchEquipe = async (empresaId: number, equipeId: number, payload: EquipePatchRequest) =>
	EquipeAdminSchema.parse((await api.patch<IEquipeAdmin>(`/equipes/empresas/${empresaId}/${equipeId}`, payload)).data);

export const deleteEquipe = async (empresaId: number, equipeId: number) =>
	await api.delete<void>(`/equipes/empresas/${empresaId}/${equipeId}`);