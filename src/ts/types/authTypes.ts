export interface AuthState {
    isAuth?: boolean;
    setIsAuth: (isAuth?: boolean) => void;
    logout: () => void;
}

export interface AuthTokenResponse {
    accessToken: string;
    refreshToken: string;
}