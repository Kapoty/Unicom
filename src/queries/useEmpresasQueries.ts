import { useQuery } from '@tanstack/react-query';
import { getEmpresasByUsuario } from '../services/empresaService';
import { queryClient } from '../App';
import { Empresa } from '../ts/types/empresaTypes';

export const useEmpresasByUsuarioQuery = (usuarioId?: number) => {
  return useQuery({
    queryKey: ['empresas', 'usuarios', usuarioId],
    queryFn: async () => {
		const empresas = await getEmpresasByUsuario(usuarioId!);
		empresas.forEach(e => queryClient.setQueryData<Empresa>(['empresas', e.empresaId], {...e}));
		return empresas;
	},
    enabled: !!usuarioId
  });
};