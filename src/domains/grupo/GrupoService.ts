import api from "../../shared/utils/api";
import { GrupoSchema, IGrupo } from "./Grupo";
import { GrupoPatchRequest, GrupoPostRequest } from "./GrupoPayloads";

export const getGrupos = async () =>
	(await api.get<IGrupo[]>(`/grupos`)).data.map((e: IGrupo) => GrupoSchema.parse(e));

export const getGrupoById = async (grupoId: number): Promise<IGrupo> =>
	GrupoSchema.parse((await api.get<IGrupo>(`/grupos/${grupoId}`)).data);

export const postGrupo = async (payload: GrupoPostRequest) =>
	GrupoSchema.parse((await api.post<IGrupo>(`/grupos`, payload)).data);

export const patchGrupo = async (grupoId: number, payload: GrupoPatchRequest) =>
	GrupoSchema.parse((await api.patch<IGrupo>(`/grupos/${grupoId}`, payload)).data);