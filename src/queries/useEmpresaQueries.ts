import { useQuery } from '@tanstack/react-query';
import { getEmpresaByDominio, getEmpresaById } from '../services/empresaService';

export const useEmpresaByDominioQuery = (dominio: string) => {
  return useQuery({
    queryKey: ['empresas', 'dominios', dominio],
    queryFn: async () => getEmpresaByDominio(dominio),
    retry: 3
  });
};

export const useEmpresaQuery = (empresaId?: number) => {
  return useQuery({
    queryKey: ['empresas', empresaId],
    queryFn: async () => getEmpresaById(empresaId!),
    enabled: !!empresaId
  });
};