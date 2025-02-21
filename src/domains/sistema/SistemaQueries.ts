import { useQuery } from '@tanstack/react-query';
import { getSistemaAdminByEmpresaIdAndSistemaId, getSistemaByEmpresaIdAndSistemaId, getSistemasAdminByEmpresaId, getSistemasByEmpresaId } from './SistemaService';

export const useSistemasByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['sistemas', 'empresas', empresaId],
		queryFn: async () => getSistemasByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useSistemasAdminByEmpresaIdQuery = (empresaId?: number) => {

	return useQuery({
		queryKey: ['sistemas', 'empresas', empresaId, 'admin'],
		queryFn: async () => getSistemasAdminByEmpresaId(empresaId!),
		enabled: !!empresaId
	});
};

export const useSistemaByEmpresaIdAndSistemaIdQuery = (empresaId?: number, sistemaId?: number) => {

	return useQuery({
		queryKey: ['sistemas', 'empresas', empresaId, sistemaId],
		queryFn: async () => getSistemaByEmpresaIdAndSistemaId(empresaId!, sistemaId!),
		enabled: !!empresaId && !!sistemaId
	});
};

export const useSistemaAdminByEmpresaIdAndSistemaIdQuery = (empresaId?: number, sistemaId?: number) => {

	return useQuery({
		queryKey: ['sistemas', 'empresas', empresaId, sistemaId, 'admin'],
		queryFn: async () => getSistemaAdminByEmpresaIdAndSistemaId(empresaId!, sistemaId!),
		enabled: !!empresaId && !!sistemaId
	});
};