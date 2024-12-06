export const formatCnpj = (cnpj: string) => cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
export const unformatCnpj = (cnpj: string) => cnpj.replace(/\D/g, "");
export const testCnpjFormat = (cnpj: string) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);