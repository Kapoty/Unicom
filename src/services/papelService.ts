import { Papel, PapelSchema } from '../ts/types/papelTypes';
import api from '../utils/api';

export const getPapelById = async (papelId: number): Promise<Papel> =>
    PapelSchema.parse((await api.get(`/papeis/${papelId}`)).data);

export const getPapeis = async (): Promise<Papel[]> =>
    (await api.get(`/papeis`)).data.map((p: Papel) => PapelSchema.parse(p));