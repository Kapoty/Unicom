import Cookies from 'js-cookie'

export const getAccessToken = (): string | undefined => Cookies.get("accessToken");

export const setAccessToken = (token?: string) => token ? Cookies.set("accessToken", token) : Cookies.remove("accessToken");

export const getRefreshToken = (): string | undefined => Cookies.get("refreshToken");

export const setRefreshToken = (token?: string) => token ? Cookies.set("refreshToken", token) : Cookies.remove("refreshToken");

export const setTokens = (accessToken?: string, refreshToken?: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
}

export const deleteTokens = () => {
    setAccessToken();
    setRefreshToken();
}