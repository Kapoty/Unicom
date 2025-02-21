import { useQuery } from '@tanstack/react-query';
import { getPdvAdminByEmpresaIdAndPdvId, getPdvByEmpresaIdAndPdvId, getPdvsAdminByEmpresaId, getPdvsByEmpresaId } from './PdvService';

export const usePdvsByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['pdvs', 'empresas', empresaId],
		queryFn: async () => getPdvsByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const usePdvsAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['pdvs', 'empresas', empresaId, 'admin'],
		queryFn: async () => getPdvsAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const usePdvByEmpresaIdAndPdvIdQuery = (empresaId?: number, pdvId?: number) => {

	return useQuery({
		queryKey: ['pdvs', 'empresas', empresaId, pdvId],
		queryFn: async () => getPdvByEmpresaIdAndPdvId(empresaId!, pdvId!),
		enabled: !!empresaId && !!pdvId
	});
};

export const usePdvAdminByEmpresaIdAndPdvIdQuery = (empresaId?: number, pdvId?: number) => {

	return useQuery({
		queryKey: ['pdvs', 'empresas', empresaId, pdvId, 'admin'],
		queryFn: async () => getPdvAdminByEmpresaIdAndPdvId(empresaId!, pdvId!),
		enabled: !!empresaId && !!pdvId
	});
};