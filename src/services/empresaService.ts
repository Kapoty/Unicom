import { Empresa, EmpresaPublicSchema, IEmpresa, IEmpresaPublic } from '../models/Empresa';
import api from '../utils/api';

export const getEmpresaByDominio = async (dominio: string): Promise<IEmpresaPublic> =>
	EmpresaPublicSchema.parse((await api.get<IEmpresaPublic>(`/empresas/dominios/dominio?dominio=${dominio}`)).data);

export const getArquivoUrl = (empresaId: number, arquivo: string) => `${api.defaults.baseURL}/empresas/${empresaId}/arquivos/arquivo?arquivo=${arquivo}`;

export const getEmpresas = async (): Promise<Empresa[]> =>
	(await api.get<Empresa[]>(`/empresas`)).data.map((e: IEmpresa) => Empresa.create(e));

export const getEmpresasByUsuario = async (usuarioId: number): Promise<Empresa[]> =>
	(await api.get<IEmpresa[]>(`/empresas/usuarios/${usuarioId}`)).data.map((e: IEmpresa) => Empresa.create(e));

export const getEmpresaById = async (empresaId: number): Promise<Empresa> =>
	Empresa.create((await api.get<IEmpresa>(`/empresas/${empresaId}`)).data);