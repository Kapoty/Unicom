import { EmpresaPublic, EmpresaPublicSchema } from '../ts/types/empresaTypes';
import api from '../utils/api';

export const getEmpresaByDominio = async (dominio: string): Promise<EmpresaPublic> =>
    EmpresaPublicSchema.parse((await api.get(`/empresas/dominios/dominio?dominio=${dominio}`)).data);

export const getArquivoUrl = (empresaId: number, arquivo: string) => `${api.defaults.baseURL}/empresas/${empresaId}/arquivos/arquivo?arquivo=${arquivo}`;