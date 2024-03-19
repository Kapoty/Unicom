export const isAuth = () => {
  return window.localStorage.getItem("ponto-token") != null;
};

export const getToken = () => {
  return isAuth() ? window.localStorage.getItem("ponto-token") : "";
};


export const setToken = (token) => {
  window.localStorage.setItem("ponto-token", token);
};

export const removeToken = () => {
  window.localStorage.removeItem("ponto-token");
};