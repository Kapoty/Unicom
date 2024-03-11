export const isAuth = () => {
  return window.localStorage.getItem("token") != null;
};

export const getToken = () => {
  return isAuth() ? window.localStorage.getItem("token") : "";
};


export const setToken = (token) => {
  window.localStorage.setItem("token", token);
};

export const removeToken = () => {
  window.localStorage.removeItem("token");
};