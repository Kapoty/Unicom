import { useQuery } from '@tanstack/react-query';
import { getEmpresasByUsuario } from '../services/empresaService';

export const useEmpresasByUsuarioQuery = (usuarioId?: number) => {
  return useQuery({
    queryKey: ['empresas', 'usuarios', usuarioId],
    queryFn: async () => getEmpresasByUsuario(usuarioId!),
    enabled: !!usuarioId
  });
};