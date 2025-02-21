import { z } from "zod";
import { apiDateTimeToDateSchema } from "../../shared/utils/dateUtils";
import { VendaTipoProdutoSchema } from "../venda/Venda";

export const VendaStatusCategoriaSchema = z.enum(['PRE_VENDA', 'POS_VENDA']);

export const VendaStatusTipoSchema = z.enum(['NOVA', 'EM_CADASTRO', 'RETORNADA', 'EXCLUIDA', 'CANCELADA_INTERNAMENTE',
	'ALTERAR_VENDEDOR', 'AGUARDANDO_DOCUMENTACAO', 'EM_TRATATIVA_INTERNAMENTE', 'AGUARDANDO_INSTALACAO',
	'EM_ROTA', 'GROSS', 'ATIVA', 'REVERTIDA', 'BACKLOG', 'CANCELADA',
	'EM_TRATATIVA', 'CHURN', 'AGUARDANDO_ANALISE', 'AGUARDANDO_REANALISE',
	'AGUARDANDO_ACEITE', 'REPROVADA']);

export const VendaStatusSchema = z.object({
	vendaStatusId: z.number(),
	empresaId: z.nullable(z.number()),
	nome: z.string(),
	icone: z.string(),
	categoria: VendaStatusCategoriaSchema,
	cor: z.string(),
	ordem: z.number(),
	tipoProduto: z.nullable(VendaTipoProdutoSchema),
	tipo: VendaStatusTipoSchema,
});

export type IVendaStatus = z.infer<typeof VendaStatusSchema>;

export const VendaStatusAdminSchema = VendaStatusSchema.extend({
	createdAt: apiDateTimeToDateSchema,
	updatedAt: apiDateTimeToDateSchema,
});

export type IVendaStatusAdmin = z.infer<typeof VendaStatusAdminSchema>;