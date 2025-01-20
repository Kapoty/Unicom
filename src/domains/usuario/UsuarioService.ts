import { IUsuarioAdmin, IUsuarioMe, IUsuarioMeAPI, IUsuarioPublic, IUsuarioPublicAPI, UsuarioAdminSchema, UsuarioMeSchema, UsuarioPublicSchema } from './Usuario';
import api from '../../shared/utils/api';
import { UsuarioBuscarRequest, UsuarioMePatchRequest, UsuarioPatchRequest, UsuarioPostRequest } from './UsuarioPayloads';

export const getMe = async (): Promise<IUsuarioMe> =>
    UsuarioMeSchema.parse((await api.get<IUsuarioMeAPI>("/usuarios/me")).data);

export const patchMe = async (payload: UsuarioMePatchRequest) =>
	UsuarioMeSchema.parse((await api.patch<IUsuarioAdmin>(`/usuarios/me`, payload)).data);

export const getUsuariosAdminByEmpresaId = async (empresaId: number): Promise<IUsuarioAdmin[]> =>
    (await api.get<IUsuarioAdmin[]>(`/usuarios/empresas/${empresaId}/admin`)).data.map(usuario => UsuarioAdminSchema.parse(usuario));

export const getUsuarioAdminByEmpresaIdAndUsuarioId = async (empresaId: number, usuarioId: number): Promise<IUsuarioAdmin> =>
    UsuarioAdminSchema.parse((await api.get<IUsuarioAdmin>(`/usuarios/empresas/${empresaId}/${usuarioId}/admin`)).data);

export const postUsuario = async (empresaId: number, payload: UsuarioPostRequest) =>
	UsuarioAdminSchema.parse((await api.post<IUsuarioAdmin>(`/usuarios/empresas/${empresaId}`, payload)).data);

export const patchUsuario = async (empresaId: number, usuarioId: number, payload: UsuarioPatchRequest) =>
	UsuarioAdminSchema.parse((await api.patch<IUsuarioAdmin>(`/usuarios/empresas/${empresaId}/${usuarioId}`, payload)).data);

export const getUsuarioPublicByUsuarioId = async (usuarioId: number): Promise<IUsuarioPublic> =>
    UsuarioPublicSchema.parse((await api.get<IUsuarioPublicAPI>(`/usuarios/${usuarioId}/public`)).data);

export const buscarUsuario = async (payload: UsuarioBuscarRequest): Promise<IUsuarioPublic> =>
    UsuarioPublicSchema.parse((await api.post<IUsuarioPublicAPI>(`/usuarios/buscar`, payload)).data);