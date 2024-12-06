import api from "../../shared/utils/api";
import { GrupoSchema, IGrupo } from "./Grupo";

export const getGruposAdmin = async () =>
	(await api.get<IGrupo[]>(`/grupos/admin`)).data.map((e: IGrupo) => GrupoSchema.parse(e));