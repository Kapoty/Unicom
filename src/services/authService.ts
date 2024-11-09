import { AuthTokenResponse } from '../ts/types/authTypes';
import api from '../utils/api';

export const refreshTokens = async (refreshToken: string): Promise<AuthTokenResponse> => (await api.post("/auth/refresh-token", {
    refreshToken: refreshToken
}, {
    _retry: true
})).data;