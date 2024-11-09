import { z } from "zod";

export const GrupoSchema = z.object({
    grupoId: z.number(),
    nome: z.string(),
})

export const AparenciaSchema = z.object({
    cor: z.string(),
    icone: z.string(),
})

export const EmpresaPublicSchema = z.object({
    empresaId: z.number(),
    grupo: GrupoSchema,
    nome: z.string(),
    aparencia: z.nullable(AparenciaSchema),
});

export type EmpresaPublic = z.infer<typeof EmpresaPublicSchema>;