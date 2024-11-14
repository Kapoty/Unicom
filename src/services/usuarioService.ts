import { IUsuarioMe, IUsuarioMeAPI, UsuarioMeSchema } from '../models/Usuario';
import api from '../utils/api';

export const getMe = async (): Promise<IUsuarioMe> =>
    UsuarioMeSchema.parse((await api.get<IUsuarioMeAPI>("/usuarios/me")).data);