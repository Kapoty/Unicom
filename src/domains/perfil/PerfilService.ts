import { IPerfil, PerfilSchema} from './Perfil';
import api from '../../shared/utils/api';

export const getPerfilById = async (perfilId: number): Promise<IPerfil> =>
    PerfilSchema.parse((await api.get<IPerfil>(`/perfis/${perfilId}`)).data);

export const getPerfilByUsuarioIdAndEmpresaId = async (usuarioId: number, empresaId: number): Promise<IPerfil> =>
    PerfilSchema.parse((await api.get<IPerfil>(`/perfis/usuarios/${usuarioId}/empresas/${empresaId}`)).data);

export const getFotoUrl = (perfilId: number) => `${api.defaults.baseURL}/perfis/${perfilId}/foto`;