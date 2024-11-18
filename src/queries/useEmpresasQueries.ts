import { useQuery } from '@tanstack/react-query';
import { getEmpresas, getEmpresasByUsuario } from '../services/empresaService';
import { Empresa } from '../models/Empresa';
import queryClient from '../utils/queryClient';
import { delay } from '../utils/timingUtil';

export const useEmpresasQuery = (enabled = true) => {
	return useQuery({
	  queryKey: ['empresas'],
	  queryFn: async () => {await delay(2000); return getEmpresas()},
	  enabled: enabled,
	});
  };

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