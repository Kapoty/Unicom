import axios from 'axios';

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        autoLogout?: boolean
    }
}