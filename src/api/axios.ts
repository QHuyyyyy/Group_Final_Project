import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse} from '../models/ApiResponse';
import { createRoot } from 'react-dom/client';
import React from 'react';
import UserSpinner from '../components/user/UserSpinner';

const loadingManager = {
  count: 0,
  spinnerElement: null as HTMLDivElement | null,
  spinnerRoot: null as any,

  show() {
    this.count++;
    if (this.count === 1) {
      this.spinnerElement = document.createElement('div');
      this.spinnerElement.id = 'global-loading-spinner';
      
      Object.assign(this.spinnerElement.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999'
      });
      
      document.body.appendChild(this.spinnerElement);
      
      this.spinnerRoot = createRoot(this.spinnerElement);
      this.spinnerRoot.render(React.createElement(UserSpinner));
    }
  },

  hide() {
    this.count--;
    if (this.count <= 0) {
      this.count = 0;
      if (this.spinnerElement && this.spinnerRoot) {
        this.spinnerRoot.unmount();
        document.body.removeChild(this.spinnerElement);
        this.spinnerElement = null;
        this.spinnerRoot = null;
      }
    }
  }
};

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (config.showSpinner !== false) {
      loadingManager.show();
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    loadingManager.hide();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>): AxiosResponse<T> => {
    if (response.config.showSpinner !== false) {
      loadingManager.hide();
    }
    return response as AxiosResponse<T>;
  },
  (error) => {
    if (error.config?.showSpinner !== false) {
      loadingManager.hide();
    }
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    // }
    console.log(error);
    return Promise.reject(error);
  }
);

declare module 'axios' {
  interface AxiosRequestConfig {
    showSpinner?: boolean;
  }
}

// Common API utility functions
export const apiUtils = {
  /**
   * Generic GET request
   * @param url - API endpoint
   * @param params - Query parameters
   * @param config - Additional axios config
   */
  async get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get(url, { ...config, params });
    return response.data.data;
  },

  /**
   * Generic POST request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post(url, data, config);
    return response.data.data;
  },

  /**
   * Generic PUT request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put(url, data, config);
    return response.data.data;
  },

  /**
   * Generic DELETE request
   * @param url - API endpoint
   * @param config - Additional axios config
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete(url, config);
    return response.data.data;
  },

  /**
   * Generic PATCH request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch(url, data, config);
    return response.data.data;
  },

  /**
   * Upload file(s)
   * @param url - API endpoint
   * @param files - File or array of files to upload
   * @param config - Additional axios config
   */
  async uploadFiles<T>(url: string, files: File | File[], config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    } else {
      formData.append('file', files);
    }

    const response = await api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};


export default api;