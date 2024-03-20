import Cookies from 'js-cookie'

export const isAuth = () => {
  return Cookies.get("token") != undefined;
};

export const getToken = () => {
  return isAuth() ? Cookies.get("token") : "";
};


export const setToken = (token) => {
  Cookies.set("token", token);
};

export const removeToken = () => {
  Cookies.remove("token");
};