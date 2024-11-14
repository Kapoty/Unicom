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

export type IEmpresaPublic = z.infer<typeof EmpresaPublicSchema>;

export const EmpresaSchema = EmpresaPublicSchema.extend({
	cnpj: z.string()
})

export type IEmpresa = z.infer<typeof EmpresaSchema>;

export class Empresa implements IEmpresa {
	empresaId!: IEmpresa['empresaId'];
	grupo!: IEmpresa['grupo'];
	nome!: IEmpresa['nome'];
	aparencia!: IEmpresa['aparencia'];
	cnpj!: IEmpresa['cnpj'];

	private constructor(dados: IEmpresa) {
		Object.assign(this, dados);
	}

	static create(dados: IEmpresa) {
		return new Empresa(EmpresaSchema.parse(dados));
	}
}