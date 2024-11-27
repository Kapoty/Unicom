import { JwtResponse, LoginRequest } from './Auth';
import api from '../../shared/utils/api';

export const login = async (loginRequest: LoginRequest): Promise<JwtResponse> => (await api.post("/auth/login", loginRequest, {
    _retry: true
})).data;

export const refreshTokens = async (refreshToken: string): Promise<JwtResponse> => (await api.post("/auth/refresh-token", {
    refreshToken: refreshToken
}, {
    _retry: true,
})).data;