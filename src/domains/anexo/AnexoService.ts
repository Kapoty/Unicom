import api from '../../shared/utils/api';
import { AnexoSchema, IAnexo } from './Anexo';
export const getAnexosByUsuarioId = async (usuarioId: number): Promise<IAnexo[]> =>
	(await api.get<IAnexo[]>(`/anexos/usuarios/${usuarioId}`)).data.map((a: IAnexo) => AnexoSchema.parse(a));

export const uploadByUsuarioId = async (usuarioId: number, file: File) => {
	let formData = new FormData();
	formData.append('file', file);
	let config = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	};

	return await api.post<Partial<IAnexo>>(`/anexos/usuarios/${usuarioId}/upload`, formData, config);
}

export const trashByUsuarioIdAndFileId = async (usuarioId: number, fileId: string) =>
	await api.post<void>(`/anexos/usuarios/${usuarioId}/${fileId}/trash`);

export const untrashByUsuarioIdAndFileId = async (usuarioId: number, fileId: string) =>
	await api.post<void>(`/anexos/usuarios/${usuarioId}/${fileId}/untrash`);

export const deleteByUsuarioIdAndFileId = async (usuarioId: number, fileId: string) =>
	await api.post<void>(`/anexos/usuarios/${usuarioId}/${fileId}/delete`);