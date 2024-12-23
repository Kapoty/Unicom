import { useQuery } from "@tanstack/react-query";
import { getGrupoById, getGrupos } from "./GrupoService";

export const useGruposQuery = () => {
	return useQuery({
		queryKey: ['grupos'],
		queryFn: async () => getGrupos(),
	});
};

export const useGrupoQuery = (grupoId?: number) => {
	return useQuery({
		queryKey: ['grupos', grupoId],
		queryFn: async () => getGrupoById(grupoId!!),
		enabled: !!grupoId
	})
}