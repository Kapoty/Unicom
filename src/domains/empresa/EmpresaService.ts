import { EmpresaSchema, EmpresaPublicSchema, IEmpresa, IEmpresaPublic, EmpresaAdminSchema, IEmpresaAdmin } from './Empresa';
import api from '../../shared/utils/api';

export const getEmpresaByDominio = async (dominio: string) =>
	EmpresaPublicSchema.parse((await api.get<IEmpresaPublic>(`/empresas/dominios/dominio?dominio=${dominio}`)).data);

export const getArquivoUrl = (empresaId: number, arquivo: string) => `${api.defaults.baseURL}/empresas/${empresaId}/arquivos/arquivo?arquivo=${arquivo}`;

export const getEmpresasAdmin = async () =>
	(await api.get<IEmpresaAdmin[]>(`/empresas/admin`)).data.map((e: IEmpresaAdmin) => EmpresaAdminSchema.parse(e));

export const getEmpresasByUsuario = async (usuarioId: number) =>
	(await api.get<IEmpresa[]>(`/empresas/usuarios/${usuarioId}`)).data.map((e: IEmpresa) => EmpresaSchema.parse(e));

export const getEmpresaPublicById = async (empresaId: number) =>
	EmpresaPublicSchema.parse((await api.get<IEmpresaPublic>(`/empresas/${empresaId}/public`)).data);

export const getEmpresaAdminById = async (empresaId: number) =>
	EmpresaAdminSchema.parse((await api.get<IEmpresaAdmin>(`/empresas/${empresaId}/admin`)).data);

export const getEmpresaById = async (empresaId: number): Promise<IEmpresa> =>
	EmpresaSchema.parse((await api.get<IEmpresa>(`/empresas/${empresaId}`)).data);