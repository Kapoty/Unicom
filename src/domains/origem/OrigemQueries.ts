import { useQuery } from '@tanstack/react-query';
import { getOrigemAdminByEmpresaIdAndOrigemId, getOrigemByEmpresaIdAndOrigemId, getOrigensAdminByEmpresaId, getOrigensByEmpresaId } from './OrigemService';

export const useOrigensByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['origens', 'empresas', empresaId],
		queryFn: async () => getOrigensByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useOrigensAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['origens', 'empresas', empresaId, 'admin'],
		queryFn: async () => getOrigensAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useOrigemByEmpresaIdAndOrigemIdQuery = (empresaId?: number, origemId?: number) => {

	return useQuery({
		queryKey: ['origens', 'empresas', empresaId, origemId],
		queryFn: async () => getOrigemByEmpresaIdAndOrigemId(empresaId!, origemId!),
		enabled: !!empresaId && !!origemId
	});
};

export const useOrigemAdminByEmpresaIdAndOrigemIdQuery = (empresaId?: number, origemId?: number) => {

	return useQuery({
		queryKey: ['origens', 'empresas', empresaId, origemId, 'admin'],
		queryFn: async () => getOrigemAdminByEmpresaIdAndOrigemId(empresaId!, origemId!),
		enabled: !!empresaId && !!origemId
	});
};