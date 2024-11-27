import { IPapel, IPapelAPI, Papel } from './Papel';
import api from '../../shared/utils/api';

export const getPapelById = async (papelId: number): Promise<Papel> =>
    Papel.create((await api.get<IPapelAPI>(`/papeis/${papelId}`)).data);

export const getPapeis = async (): Promise<Papel[]> =>
    (await api.get<IPapelAPI[]>(`/papeis`)).data.map((p: IPapelAPI) => Papel.create(p));