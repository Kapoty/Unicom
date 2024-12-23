export const toBase64 = (file: File) => {
	return new Promise<string | undefined>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result?.toString());
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});
};