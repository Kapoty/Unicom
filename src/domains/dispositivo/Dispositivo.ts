import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";

export const DispositivoSchema = z.object({
	token: z.string(),
	usuarioId: z.nullable(z.number()),
	dataCriacao: apiDateTimeToDateSchema,
	dataExpiracao: apiDateTimeToDateSchema,
	sistemaOperacional: z.string(),
	navegador: z.string(),
	ip: z.string(),
});

export type IDispositivo = z.infer<typeof DispositivoSchema>;