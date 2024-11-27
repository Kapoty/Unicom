import { useQuery } from '@tanstack/react-query';
import { getEmpresaAdminById, getEmpresaByDominio, getEmpresaById, getEmpresaPublicById, getEmpresasAdmin, getEmpresasByUsuario } from './EmpresaService';
import { delay } from '../../shared/utils/timingUtil';
import queryClient from '../../shared/utils/queryClient';
import { IEmpresa } from './Empresa';

export const useEmpresaByDominioQuery = (dominio: string) => {
	return useQuery({
		queryKey: ['empresas', 'dominios', dominio],
		queryFn: async () => getEmpresaByDominio(dominio),
		retry: 3
	});
};

export const useEmpresaPublicQuery = (empresaId?: number) => {
	return useQuery({
		queryKey: ['empresas', empresaId, 'public'],
		queryFn: async () => getEmpresaPublicById(empresaId!),
		enabled: !!empresaId
	});
};

export const useEmpresaAdminQuery = (empresaId?: number) => {
	return useQuery({
		queryKey: ['empresas', empresaId, 'admin'],
		queryFn: async () => getEmpresaAdminById(empresaId!),
		enabled: !!empresaId
	});
};

export const useEmpresaQuery = (empresaId?: number) => {
	return useQuery({
		queryKey: ['empresas', empresaId],
		queryFn: async () => getEmpresaById(empresaId!),
		enabled: !!empresaId
	});
};

export const useEmpresasAdminQuery = (enabled = true) => {
	return useQuery({
		queryKey: ['empresas', 'admin'],
		queryFn: async () => { await delay(0); return getEmpresasAdmin() },
		enabled: enabled,
	});
};

export const useEmpresasByUsuarioQuery = (usuarioId?: number) => {
	return useQuery({
		queryKey: ['empresas', 'usuarios', usuarioId],
		queryFn: async () => {
			const empresas = await getEmpresasByUsuario(usuarioId!);
			empresas.forEach(e => queryClient.setQueryData<IEmpresa>(['empresas', e.empresaId], { ...e }));
			return empresas;
		},
		enabled: !!usuarioId
	});
};