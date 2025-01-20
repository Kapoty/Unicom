import { useQuery } from "@tanstack/react-query";
import { getDispositivosByUsuarioId } from "./DispositivoService";

export const useDispositivosByUsuarioIdQuery = (usuarioId?: number) => {

	return useQuery({
		queryKey: ['dispositivos', 'usuarios', usuarioId],
		queryFn: async () => getDispositivosByUsuarioId(usuarioId!),
		enabled: !!usuarioId
	});
};