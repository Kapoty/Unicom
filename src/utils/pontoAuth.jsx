export const isPontoAuth = () => {
  return window.localStorage.getItem("ponto-token") != null;
};

export const getPontoToken = () => {
  return isPontoAuth() ? window.localStorage.getItem("ponto-token") : "";
};


export const setPontoToken = (token) => {
  window.localStorage.setItem("ponto-token", token);
};

export const removePontoToken = () => {
  window.localStorage.removeItem("ponto-token");
};