import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const EquipePostRequestSchema = z.object({
	nome: z.string(),
	icone: z.nullable(z.string()),
	supervisorId: z.number(),
});

export type EquipePostRequest = z.infer<typeof EquipePostRequestSchema>;

export const EquipePatchRequestSchema = z.object({
	nome: z.string(),
	icone: z.nullable(z.string()),
	supervisorId: z.number(),
	updatedAt: dateToApiDateTimeSchema,
});

export type EquipePatchRequest = z.infer<typeof EquipePatchRequestSchema>;