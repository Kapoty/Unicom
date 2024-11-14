import { z } from "zod";

export const PerfilSchema = z.object({
	perfilId: z.number(),
	usuarioId: z.nullable(z.number()),
	empresaId: z.number(),
	papelId: z.number(),
	aceito: z.boolean(),
	ativo: z.boolean(),
	nome: z.string(),
	foto: z.nullable(z.string()),
});

export type IPerfil = z.infer<typeof PerfilSchema>;

export class Perfil implements IPerfil {
	perfilId!: IPerfil['perfilId'];
	usuarioId!: IPerfil['usuarioId'];
	empresaId!: IPerfil['empresaId'];
	papelId!: IPerfil['papelId'];
	aceito!: IPerfil['aceito'];
	ativo!: IPerfil['ativo'];
	nome!: IPerfil['nome'];
	foto!: IPerfil['foto'];

	private constructor(dados: IPerfil) {
		Object.assign(this, dados);
	}

	static create(dados: IPerfil) {
		return new Perfil(PerfilSchema.parse(dados));
	}

}