import api from "../../shared/utils/api";
import { DominioSchema, IDominio } from "./Dominio";
import { DominioPatchRequest, DominioPostRequest } from "./DominioPayloads";

export const getDominios = async () =>
	(await api.get<IDominio[]>(`/dominios`)).data.map((e: IDominio) => DominioSchema.parse(e));

export const getDominioById = async (dominioId: number): Promise<IDominio> =>
	DominioSchema.parse((await api.get<IDominio>(`/dominios/${dominioId}`)).data);

export const postDominio = async (payload: DominioPostRequest) =>
	DominioSchema.parse((await api.post<IDominio>(`/dominios`, payload)).data);

export const patchDominio = async (dominioId: number, payload: DominioPatchRequest) =>
	DominioSchema.parse((await api.patch<IDominio>(`/dominios/${dominioId}`, payload)).data);

export const deleteDominio = async (dominioId: number) =>
	await api.delete<void>(`/dominios/${dominioId}`);