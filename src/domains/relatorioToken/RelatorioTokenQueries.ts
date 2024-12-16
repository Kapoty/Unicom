import { useQuery } from '@tanstack/react-query';
import { getRelatorioTokenByUsuarioId } from './RelatorioTokenService';

export const useRelatorioTokenByUsuariolId = (usuarioId?: number) => {

	return useQuery({
		queryKey: ['relatorio-tokens', 'usuarios', usuarioId],
		queryFn: async () => getRelatorioTokenByUsuarioId(usuarioId!),
		enabled: !!usuarioId
	});
};