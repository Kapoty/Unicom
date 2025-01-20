import api from '../../shared/utils/api';
import { DispositivoSchema, IDispositivo } from './Dispositivo';

export const getDispositivosByUsuarioId = async (usuarioId: number): Promise<IDispositivo[]> =>
    (await api.get<IDispositivo[]>(`/dispositivos/usuarios/${usuarioId}`)).data.map((d: IDispositivo) => DispositivoSchema.parse(d));

export const excluirDispositivo = async (token: string) =>
	await api.post<void>(`/dispositivos/${token}/excluir`);