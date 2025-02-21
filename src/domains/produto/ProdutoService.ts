import api from '../../shared/utils/api';
import { IProduto, IProdutoAdmin, ProdutoAdminSchema, ProdutoSchema } from './Produto';
import { ProdutoPatchRequest, ProdutoPostRequest } from './ProdutoPayloads';

export const getProdutosByEmpresaId = async (empresaId: number): Promise<IProduto[]> =>
    (await api.get<IProduto[]>(`/produtos/empresas/${empresaId}`)).data.map(produto => ProdutoAdminSchema.parse(produto));

export const getProdutosAdminByEmpresaId = async (empresaId: number): Promise<IProdutoAdmin[]> =>
    (await api.get<IProdutoAdmin[]>(`/produtos/empresas/${empresaId}/admin`)).data.map(produto => ProdutoAdminSchema.parse(produto));

export const getProdutoByEmpresaIdAndProdutoId = async (empresaId: number, produtoId: number): Promise<IProduto> =>
    ProdutoSchema.parse((await api.get<IProduto>(`/produtos/empresas/${empresaId}/${produtoId}`)).data);

export const getProdutoAdminByEmpresaIdAndProdutoId = async (empresaId: number, produtoId: number): Promise<IProdutoAdmin> =>
    ProdutoAdminSchema.parse((await api.get<IProdutoAdmin>(`/produtos/empresas/${empresaId}/${produtoId}/admin`)).data);

export const postProduto = async (empresaId: number, payload: ProdutoPostRequest) =>
	ProdutoAdminSchema.parse((await api.post<IProdutoAdmin>(`/produtos/empresas/${empresaId}`, payload)).data);

export const patchProduto = async (empresaId: number, produtoId: number, payload: ProdutoPatchRequest) =>
	ProdutoAdminSchema.parse((await api.patch<IProdutoAdmin>(`/produtos/empresas/${empresaId}/${produtoId}`, payload)).data);

export const deleteProduto = async (empresaId: number, produtoId: number) =>
	await api.delete<void>(`/produtos/empresas/${empresaId}/${produtoId}`);