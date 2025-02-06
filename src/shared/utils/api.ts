import axios, { AxiosError } from 'axios';
import { getAccessToken, setAccessToken, getRefreshToken } from './authUtil';
import {refreshTokens} from '../../domains/auth/AuthService';
import useAuthStore from '../../domains/auth/useAuthStore';

declare module 'axios' {
	interface InternalAxiosRequestConfig {
		autoLogout?: boolean
	}

	interface AxiosRequestConfig {
		_retry?: boolean,
	}
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let refreshErrorSubscribers: Array<(error: AxiosError) => void> = [];

const onRefreshed = (accessToken: string) => {
	refreshSubscribers.forEach(callback => callback(accessToken));
	refreshSubscribers = [];
}

const onRefreshFailed = (error: AxiosError) => {
    refreshErrorSubscribers.forEach(callback => callback(error));
    refreshErrorSubscribers = [];
}

const addRefreshSubscriber = (callback: (token: string) => void) => refreshSubscribers.push(callback);

const addRefreshErrorSubscriber = (callback: (error: AxiosError) => void) => refreshErrorSubscribers.push(callback);

const refreshAccessToken = async (): Promise<string> => {
	try {
		var newAccessToken = (await refreshTokens(getRefreshToken()!)).accessToken;
		setAccessToken(newAccessToken);
		return newAccessToken;
	} catch (error) {
		throw error;
	}
}

const api = axios.create({
	baseURL: process.env.NODE_ENV === "development" ? "https://192.168.100.4:8000/api" /*"https://dev.unisystem.app.br:8000/api"*/ : "https://dev.unisystem.app.br:8000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const accessToken = getAccessToken();
		if (accessToken)
			config.headers['Authorization'] = `Bearer ${accessToken}`;

		if (!("autoLogout" in config))
			config['autoLogout'] = true;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		var originalRequest = error.config;

		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					addRefreshSubscriber(newAccessToken => {
						originalRequest.headers['Authorization'] =  `Bearer ${newAccessToken}`
						resolve(axios(originalRequest));
					});
					addRefreshErrorSubscriber(reject);
				});
			} else if (`Bearer ${getAccessToken()}` !== originalRequest.headers['Authorization']) {
				originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;
				return api(originalRequest);
			}

			isRefreshing = true;

			try {

				console.log("Renovando accessToken...");
				const newAccessToken = await refreshAccessToken();
				console.log("accessToken renovado com sucesso!")

				onRefreshed(newAccessToken);

				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				console.error("Falha ao renovar accessToken!", error);
				useAuthStore.getState().logout(true);
				onRefreshFailed(refreshError as AxiosError);
			} finally {
				isRefreshing = false;
            }

		}

		return Promise.reject(error);
	}
);

export default api;