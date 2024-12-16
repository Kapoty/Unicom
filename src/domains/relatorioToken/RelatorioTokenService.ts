import api from '../../shared/utils/api';
import { IRelatorioToken, RelatorioTokenSchema } from './RelatorioToken';

export const getRelatorioTokenByUsuarioId = async (usuarioId: number): Promise<IRelatorioToken> =>
    RelatorioTokenSchema.parse((await api.get<IRelatorioToken>(`/relatorios-tokens/usuarios/${usuarioId}`)).data);