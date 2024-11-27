export interface LoginRequest {
	dominio: string;
	login: string;
	senha: string;
}

export interface JwtResponse {
	accessToken: string;
	refreshToken: string;
}