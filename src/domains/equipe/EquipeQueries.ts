import { useQuery } from '@tanstack/react-query';
import { getEquipeAdminByEmpresaIdAndEquipeId, getEquipeByEmpresaIdAndEquipeId, getEquipeInfoByEmpresaIdAndEquipeId, getEquipesAdminByEmpresaId, getEquipesByPerfilId } from './EquipeService';

export const useEquipesByPerfilQuery = (perfilId?: number) => {

	return useQuery({
		queryKey: ['equipes', 'perfis', perfilId],
		queryFn: async () => getEquipesByPerfilId(perfilId!),
		enabled: !!perfilId
	});
};

export const useEquipesAdminByEmpresaIdQuery = (empresaId?: number, enabled = true) => {

	return useQuery({
		queryKey: ['equipes', 'empresas', empresaId, 'admin'],
		queryFn: async () => getEquipesAdminByEmpresaId(empresaId!),
		enabled: !!empresaId && enabled
	});
};

export const useEquipeByEmpresaIdAndEquipeIdQuery = (empresaId?: number, equipeId?: number) => {

	return useQuery({
		queryKey: ['equipes', 'empresas', empresaId, equipeId],
		queryFn: async () => getEquipeByEmpresaIdAndEquipeId(empresaId!, equipeId!),
		enabled: !!empresaId && !!equipeId
	});
};

export const useEquipeInfoByEmpresaIdAndEquipeIdQuery = (empresaId?: number, equipeId?: number) => {

	return useQuery({
		queryKey: ['equipes', 'empresas', empresaId, equipeId, 'info'],
		queryFn: async () => getEquipeInfoByEmpresaIdAndEquipeId(empresaId!, equipeId!),
		enabled: !!empresaId && !!equipeId
	});
};

export const useEquipeAdminByEmpresaIdAndEquipeIdQuery = (empresaId?: number, equipeId?: number) => {

	return useQuery({
		queryKey: ['equipes', 'empresas', empresaId, equipeId, 'admin'],
		queryFn: async () => getEquipeAdminByEmpresaIdAndEquipeId(empresaId!, equipeId!),
		enabled: !!empresaId && !!equipeId
	});
};