import { useQuery } from "@tanstack/react-query";
import { getDominioById, getDominios } from "./DominioService";

export const useDominiosQuery = () => {
	return useQuery({
		queryKey: ['dominios'],
		queryFn: async () => getDominios(),
	});
};

export const useDominioQuery = (dominioId?: number) => {
	return useQuery({
		queryKey: ['dominios', dominioId],
		queryFn: async () => getDominioById(dominioId!!),
		enabled: !!dominioId
	})
}