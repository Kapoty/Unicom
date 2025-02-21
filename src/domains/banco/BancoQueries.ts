import { useQuery } from '@tanstack/react-query';
import { getBancoAdminByBancoId, getBancoByBancoId, getBancos, getBancosAdmin } from './BancoService';

export const useBancosQuery = () => {

	return useQuery({
		queryKey: ['bancos'],
		queryFn: async () => getBancos(),
	});
};

export const useBancosAdminQuery = () => {

	return useQuery({
		queryKey: ['bancos', 'admin'],
		queryFn: async () => getBancosAdmin(),
	});
};

export const useBancoByBancoIdQuery = (bancoId?: number) => {

	return useQuery({
		queryKey: ['bancos', bancoId],
		queryFn: async () => getBancoByBancoId(bancoId!),
		enabled: !!bancoId
	});
};

export const useBancoAdminByBancoIdQuery = (bancoId?: number) => {

	return useQuery({
		queryKey: ['bancos', bancoId, 'admin'],
		queryFn: async () => getBancoAdminByBancoId(bancoId!),
		enabled: !!bancoId
	});
};