import { z } from "zod";

export const PapelSistemaSchema = z.enum(["ADMIN", "USUARIO"]);

export type PapelSistema = z.infer<typeof PapelSistemaSchema>;