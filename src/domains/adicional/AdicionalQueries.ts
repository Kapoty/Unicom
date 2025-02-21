import { useQuery } from '@tanstack/react-query';
import { getAdicionalAdminByEmpresaIdAndAdicionalId, getAdicionalByEmpresaIdAndAdicionalId, getAdicionaisAdminByEmpresaId, getAdicionaisByEmpresaId } from './AdicionalService';

export const useAdicionaisByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['adicionais', 'empresas', empresaId],
		queryFn: async () => getAdicionaisByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useAdicionaisAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['adicionais', 'empresas', empresaId, 'admin'],
		queryFn: async () => getAdicionaisAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useAdicionalByEmpresaIdAndAdicionalIdQuery = (empresaId?: number, adicionalId?: number) => {

	return useQuery({
		queryKey: ['adicionais', 'empresas', empresaId, adicionalId],
		queryFn: async () => getAdicionalByEmpresaIdAndAdicionalId(empresaId!, adicionalId!),
		enabled: !!empresaId && !!adicionalId
	});
};

export const useAdicionalAdminByEmpresaIdAndAdicionalIdQuery = (empresaId?: number, adicionalId?: number) => {

	return useQuery({
		queryKey: ['adicionais', 'empresas', empresaId, adicionalId, 'admin'],
		queryFn: async () => getAdicionalAdminByEmpresaIdAndAdicionalId(empresaId!, adicionalId!),
		enabled: !!empresaId && !!adicionalId
	});
};