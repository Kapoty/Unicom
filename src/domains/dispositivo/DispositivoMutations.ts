import { useMutation } from "@tanstack/react-query";
import { excluirDispositivo } from "./DispositivoService";

export const useDispositivoExcluirMutation = () => {
	return useMutation({
		mutationFn: async (variables: { token: string }) =>
			excluirDispositivo(variables.token),
	})
}