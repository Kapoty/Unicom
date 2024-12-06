import { useQuery } from "@tanstack/react-query";
import { getGruposAdmin } from "./GrupoService";

export const useGruposAdminQuery = () => {
	return useQuery({
		queryKey: ['grupos', 'admin'],
		queryFn: async () => getGruposAdmin(),
	});
};