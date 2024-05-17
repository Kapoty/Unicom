import axios from "axios";
import {getToken, removeToken} from "../utils/auth"

import history from "utils/history";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "https://192.168.100.4:8000/api" : "https://unisystem.unicom.net.br:8001/api",
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!("redirect401" in config))
      config['redirect401'] = true;
    if (! ("redirect403" in config))
      config['redirect403'] = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (config) => config,
  (error) => {
    if ("response" in error) {

      if (error.response.status == 401 && error.config.redirect401) {
        removeToken();
        history.push("/login");
        return new Promise(() => {});
      } else if (error.response.status == 403 && error.config.redirect403) {
        history.push("/");
        return new Promise(() => {});
      }

    }
    
    return Promise.reject(error);
  }
);

export default api;