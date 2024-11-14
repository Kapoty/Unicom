import { Perfil} from '../models/Perfil';
import api from '../utils/api';

export const getPerfilById = async (perfilId: number): Promise<Perfil> =>
    Perfil.create((await api.get(`/perfis/${perfilId}`)).data);

export const getPerfilByUsuarioIdAndEmpresaId = async (usuarioId: number, empresaId: number): Promise<Perfil> =>
    Perfil.create((await api.get(`/perfis/usuarios/${usuarioId}/empresas/${empresaId}`)).data);

export const getFotoUrl = (perfilId: number) => `${api.defaults.baseURL}/perfis/${perfilId}/foto`;