import { IPerfil, PerfilSchema} from './Perfil';
import api from '../../shared/utils/api';
import { IPerfilAdmin, PerfilAdminSchema } from './PerfilUsuarioShared';
import { PerfilAdminPatchRequest, PerfilAdminPostRequest, PerfilAlterarEquipeRequest } from './PerfilPayloads';

export const getPerfilById = async (perfilId: number): Promise<IPerfil> =>
    PerfilSchema.parse((await api.get<IPerfil>(`/perfis/${perfilId}`)).data);

export const getPerfilByUsuarioIdAndEmpresaId = async (usuarioId: number, empresaId: number): Promise<IPerfil> =>
    PerfilSchema.parse((await api.get<IPerfil>(`/perfis/usuarios/${usuarioId}/empresas/${empresaId}`)).data);

export const getArquivoUrl = (perfilId: number, arquivo: string) => `${api.defaults.baseURL}/perfis/${perfilId}/arquivos/arquivo?arquivo=${arquivo}`;

export const getPerfisByUsuarioIdAndEmpresaId = async (usuarioId: number, empresaId: number): Promise<IPerfil[]> =>
    (await api.get<IPerfil[]>(`/perfis/usuarios/${usuarioId}?empresaId=${empresaId}`)).data.map((p: IPerfil) => PerfilSchema.parse(p));

export const aceitarPerfil = async (perfilId: number) =>
	await api.post<void>(`/perfis/${perfilId}/aceitar`);

export const recusarPerfil = async (perfilId: number) =>
	await api.post<void>(`/perfis/${perfilId}/recusar`);

export const getPerfisByEmpresaId = async (empresaId: number,): Promise<IPerfil[]> =>
    (await api.get<IPerfil[]>(`/perfis/empresas/${empresaId}`)).data.map((p: IPerfil) => PerfilSchema.parse(p));

export const getPerfisAdminByEmpresaId = async (empresaId: number,): Promise<IPerfilAdmin[]> =>
    (await api.get<IPerfilAdmin[]>(`/perfis/empresas/${empresaId}/admin`)).data.map((p: IPerfilAdmin) => PerfilAdminSchema.parse(p));

export const getPerfilAdminByEmpresaIdAndPerfilId = async (empresaId: number, perfilId: number): Promise<IPerfilAdmin> =>
    PerfilAdminSchema.parse((await api.get<IPerfilAdmin>(`/perfis/empresas/${empresaId}/${perfilId}/admin`)).data);

export const postPerfil = async (empresaId: number, payload: PerfilAdminPostRequest) =>
	PerfilAdminSchema.parse((await api.post<IPerfilAdmin>(`/perfis/empresas/${empresaId}/admin`, payload)).data);

export const patchPerfil = async (empresaId: number, perfilId: number, payload: PerfilAdminPatchRequest) =>
	PerfilAdminSchema.parse((await api.patch<IPerfilAdmin>(`/perfis/empresas/${empresaId}/${perfilId}/admin`, payload)).data);

export const alterarEquipe = async (perfilId: number, payload: PerfilAlterarEquipeRequest) =>
	await api.post<void>(`/perfis/${perfilId}/alterar-equipe`, payload);