import { AuthTokenResponse, LoginRequest } from '../ts/types/authTypes';
import api from '../utils/api';

export const login = async (loginRequest: LoginRequest): Promise<AuthTokenResponse> => (await api.post("/auth/login", loginRequest, {
    _retry: true
})).data;

export const refreshTokens = async (refreshToken: string): Promise<AuthTokenResponse> => (await api.post("/auth/refresh-token", {
    refreshToken: refreshToken
}, {
    _retry: true,
})).data;