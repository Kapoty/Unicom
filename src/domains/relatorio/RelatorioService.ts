import { IRelatorio, RelatorioSchema} from './Relatorio';
import api from '../../shared/utils/api';

export const getRelatoriosByPerfilId = async (perfilId: number): Promise<IRelatorio[]> =>
    (await api.get<IRelatorio[]>(`/relatorios/perfis/${perfilId}`)).data.map(relatorio => RelatorioSchema.parse(relatorio));

export const getRelatorioByEmpresaIdAndUriQuery = async (empresaId: number, uri: string): Promise<IRelatorio> =>
    RelatorioSchema.parse((await api.get<IRelatorio>(`/relatorios/empresas/${empresaId}/uri/${uri}`)).data);