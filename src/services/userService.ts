import { UsuarioMe, UsuarioMeSchema } from '../ts/types/usuarioTypes';
import api from '../utils/api';

export const getMe = async (): Promise<UsuarioMe> =>
    UsuarioMeSchema.parse((await api.get("/usuarios/me")).data);