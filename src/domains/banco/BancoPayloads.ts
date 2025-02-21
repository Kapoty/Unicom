import { z } from "zod";
import { dateToApiDateTimeSchema } from "../../shared/utils/dateUtils";

export const BancoPostRequestSchema = z.object({
	nome: z.string(),
});

export type BancoPostRequest = z.infer<typeof BancoPostRequestSchema>;

export const BancoPatchRequestSchema = z.object({
	nome: z.string(),
	updatedAt: dateToApiDateTimeSchema,
});

export type BancoPatchRequest = z.infer<typeof BancoPatchRequestSchema>;