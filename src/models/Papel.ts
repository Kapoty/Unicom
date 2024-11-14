import { z } from "zod";
import { Permissao, PermissaoSchema } from '../models/enums';

export const PapelAPISchema = z.object({
    papelId: z.number(),
    nome: z.string(),
    papeisAbaixo: z.array(z.number()),
    permissoes: z.array(PermissaoSchema.or(z.string())),
});

export type IPapelAPI = z.infer<typeof PapelAPISchema>;

export const PapelSchema = PapelAPISchema.transform((data) => ({
	...data
})).transform((data) => data);

export type IPapel = z.infer<typeof PapelSchema>;

export class Papel implements IPapel {
	papelId!: IPapel['papelId'];
    nome!: IPapel['nome'];
    papeisAbaixo!: IPapel['papeisAbaixo'];
    permissoes!: IPapel['permissoes'];

	private constructor(dados: IPapel) {
		Object.assign(this, dados);
	}

	static create(dados: IPapelAPI) {
		return new Papel(PapelSchema.parse(dados));
	}

	toApi() : IPapelAPI {
		return {
			...this
		}
	}

	contemPermissao(permissao: Permissao) {
		return this.permissoes.includes(permissao);
	}
}