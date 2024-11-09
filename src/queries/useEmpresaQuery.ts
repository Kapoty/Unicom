import { useQuery } from '@tanstack/react-query';
import { getEmpresaByDominio } from '../services/empresaService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useEmpresaByDominioQuery = (dominio: string) => {
  return useQuery({
    queryKey: ['empresa', dominio],
    queryFn: async () => {await delay(2000); return getEmpresaByDominio(dominio)},
    retry: 0,
  });
};