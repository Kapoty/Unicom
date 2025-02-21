import { useQuery } from '@tanstack/react-query';
import { getCampoExtraAdminByEmpresaIdAndCampoExtraSlot, getCampoExtraByEmpresaIdAndCampoExtraSlot, getCamposExtrasAdminByEmpresaId, getCamposExtrasByEmpresaId } from './CampoExtraService';

export const useCamposExtrasByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['campos-extras', 'empresas', empresaId],
		queryFn: async () => getCamposExtrasByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useCamposExtrasAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['campos-extras', 'empresas', empresaId, 'admin'],
		queryFn: async () => getCamposExtrasAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useCampoExtraByEmpresaIdAndCampoExtraSlotQuery = (empresaId?: number, campoExtraSlot?: string) => {

	return useQuery({
		queryKey: ['campos-extras', 'empresas', empresaId, campoExtraSlot],
		queryFn: async () => getCampoExtraByEmpresaIdAndCampoExtraSlot(empresaId!, campoExtraSlot!),
		enabled: !!empresaId && !!campoExtraSlot
	});
};

export const useCampoExtraAdminByEmpresaIdAndCampoExtraSlotQuery = (empresaId?: number, campoExtraSlot?: string) => {

	return useQuery({
		queryKey: ['campos-extras', 'empresas', empresaId, campoExtraSlot, 'admin'],
		queryFn: async () => getCampoExtraAdminByEmpresaIdAndCampoExtraSlot(empresaId!, campoExtraSlot!),
		enabled: !!empresaId && !!campoExtraSlot
	});
};