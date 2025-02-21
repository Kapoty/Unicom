import { useQuery } from '@tanstack/react-query';
import { getVendaStatusAdminByEmpresaIdAndVendaStatusId, getVendaStatusByEmpresaIdAndVendaStatusId, getVendaStatusAdminByEmpresaId, getVendaStatusByEmpresaId } from './VendaStatusService';

export const useVendaStatusByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['venda-status', 'empresas', empresaId],
		queryFn: async () => getVendaStatusByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useVendaStatusAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['venda-status', 'empresas', empresaId, 'admin'],
		queryFn: async () => getVendaStatusAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useVendaStatusByEmpresaIdAndVendaStatusIdQuery = (empresaId?: number, adicionalId?: number) => {

	return useQuery({
		queryKey: ['venda-status', 'empresas', empresaId, adicionalId],
		queryFn: async () => getVendaStatusByEmpresaIdAndVendaStatusId(empresaId!, adicionalId!),
		enabled: !!empresaId && !!adicionalId
	});
};

export const useVendaStatusAdminByEmpresaIdAndVendaStatusIdQuery = (empresaId?: number, adicionalId?: number) => {

	return useQuery({
		queryKey: ['venda-status', 'empresas', empresaId, adicionalId, 'admin'],
		queryFn: async () => getVendaStatusAdminByEmpresaIdAndVendaStatusId(empresaId!, adicionalId!),
		enabled: !!empresaId && !!adicionalId
	});
};