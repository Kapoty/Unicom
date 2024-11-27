import { IUsuarioMe, IUsuarioMeAPI, UsuarioMeSchema } from './Usuario';
import api from '../../shared/utils/api';

export const getMe = async (): Promise<IUsuarioMe> =>
    UsuarioMeSchema.parse((await api.get<IUsuarioMeAPI>("/usuarios/me")).data);