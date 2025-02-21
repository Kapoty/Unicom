import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const CampoExtraSlotSchema = z.enum(['CONTRATO_1', 'CONTRATO_2', 'CONTRATO_3', 'CONTRATO_4',
	'CONTRATO_5', 'CONTRATO_6', 'CONTRATO_7', 'CONTRATO_8', 'CONTRATO_9', 'CONTRATO_10',
	'ATOR_1', 'ATOR_2', 'ATOR_3', 'ATOR_4', 'ATOR_5']);

export type ICampoExtraSlot = z.infer<typeof CampoExtraSlotSchema>;

export const CampoExtraKeySchema = z.object({
	empresaId: z.number(),
	campoExtraSlot: CampoExtraSlotSchema, 
});

export type ICampoExtraKey = z.infer<typeof CampoExtraKeySchema>;

export const CampoExtraSchema = z.object({
	campoExtraId: CampoExtraKeySchema,
	nome: z.string(),
	ativo: z.boolean(),
	obrigatorio: z.boolean(),
	elevado: z.boolean(),
	sugestoes: z.array(z.string()),
	referencia: z.boolean(),
	regex: z.nullable(z.string()),
	valorPadrao: z.string(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
});

export type ICampoExtra = z.infer<typeof CampoExtraSchema>;

export const CampoExtraAdminSchema = CampoExtraSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type ICampoExtraAdmin = z.infer<typeof CampoExtraAdminSchema>;