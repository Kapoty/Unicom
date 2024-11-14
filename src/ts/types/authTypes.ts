export interface AuthState {
    isAuth?: boolean;
	setIsAuth: (isAuth?: boolean) => void;
    login: (redirect?: string) => void;
    logout: (redirect?: boolean) => void;
}

export interface LoginRequest {
    dominio: string;
    login: string;
    senha: string;
}

export interface AuthTokenResponse {
    accessToken: string;
    refreshToken: string;
}