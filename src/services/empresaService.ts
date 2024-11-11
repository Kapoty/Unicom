import { Empresa, EmpresaPublic, EmpresaPublicSchema, EmpresaSchema } from '../ts/types/empresaTypes';
import api from '../utils/api';

export const getEmpresaByDominio = async (dominio: string): Promise<EmpresaPublic> =>
    EmpresaPublicSchema.parse((await api.get(`/empresas/dominios/dominio?dominio=${dominio}`)).data);

export const getArquivoUrl = (empresaId: number, arquivo: string) => `${api.defaults.baseURL}/empresas/${empresaId}/arquivos/arquivo?arquivo=${arquivo}`;

export const getEmpresasByUsuario = async (usuarioId: number): Promise<Empresa[]> =>
    (await api.get(`/empresas/usuarios/${usuarioId}`)).data.map((e: Empresa) => EmpresaSchema.parse(e));

export const getEmpresaById = async (empresaId: number): Promise<Empresa> =>
    EmpresaSchema.parse((await api.get(`/empresas/${empresaId}`)).data);