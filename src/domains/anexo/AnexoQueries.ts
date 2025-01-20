import { useQuery } from "@tanstack/react-query";
import { getAnexosByUsuarioId } from "./AnexoService";

export const useAnexosByUsuarioIdQuery = (usuarioId?: number) => {

	return useQuery({
		queryKey: ['anexos', 'usuarios', usuarioId],
		queryFn: async () => getAnexosByUsuarioId(usuarioId!),
		enabled: !!usuarioId,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};