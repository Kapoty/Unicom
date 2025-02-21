import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const AdicionalSchema = z.object({
	adicionalId: z.number(),
	empresaId: z.number(),
	nome: z.string(),
	tipoProduto: VendaTipoProdutoSchema,
});

export type IAdicional = z.infer<typeof AdicionalSchema>;

export const AdicionalAdminSchema = AdicionalSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IAdicionalAdmin = z.infer<typeof AdicionalAdminSchema>;