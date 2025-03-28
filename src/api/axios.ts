import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse} from '../models/ApiResponse';
import { createRoot } from 'react-dom/client';
import React from 'react';
import UserSpinner from '../components/user/UserSpinner';
import { toast } from 'react-toastify';

const loadingManager = {
  count: 0,
  spinnerElement: null as HTMLDivElement | null,
  spinnerRoot: null as any,

  show() {
    this.count++;
    if (this.count === 1) {
      // Tạo container cho spinner
      this.spinnerElement = document.createElement('div');
      this.spinnerElement.id = 'global-loading-spinner';
      
      // Style cho container
      Object.assign(this.spinnerElement.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.2s ease-in-out',
      });
      
      document.body.appendChild(this.spinnerElement);
      
      // Render spinner component
      this.spinnerRoot = createRoot(this.spinnerElement);
      this.spinnerRoot.render(React.createElement(UserSpinner));
      
      // Force reflow để trigger animation
      this.spinnerElement.offsetHeight;
      this.spinnerElement.style.opacity = '1';
      
      // Prevent scrolling on the main content
      document.body.style.overflow = 'hidden';
    }
  },

  hide() {
    this.count--;
    
    if (this.count <= 0) {
      this.count = 0;
      if (this.spinnerElement && this.spinnerRoot) {
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Fade out animation
        this.spinnerElement.style.opacity = '0';
        
        // Remove after animation
        const element = this.spinnerElement;
        const root = this.spinnerRoot;
        
        setTimeout(() => {
          if (element && root) {
            root.unmount();
            element.parentNode?.removeChild(element);
          }
        }, 200);
        
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
    loadingManager.hide();
    if (error.response) {
    // Global error handling
    switch (error.response.status) {
      case 400:
        toast.error(error.response?.data?.errors[0]?.message || error.response?.data?.message)
        break;
      case 401:
        toast.error('Unauthorized: Please log in again');
        break;
      case 403:
        toast.error('Forbidden: You do not have permission');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error( error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Server error. Please try again later');
        break;
      default:
        toast.error( error.response?.data?.message || 'An unexpected error occurred');
    }
  }
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
  async get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await api.get(url, { ...config, params });
    return response as AxiosResponse<T>;
  },

  /**
   * Generic POST request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise< AxiosResponse<T>> {
    const response = await api.post(url, data, config);
    return response as AxiosResponse<T>;
  },

  /**
   * Generic PUT request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise< AxiosResponse<T>>  {
    const response = await api.put(url, data, config);
    return response  as AxiosResponse<T>
  },

  /**
   * Generic DELETE request
   * @param url - API endpoint
   * @param config - Additional axios config
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise< AxiosResponse<T>>  {
    const response = await api.delete(url, config);
    return response as AxiosResponse<T>
  },

  /**
   * Generic PATCH request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Additional axios config
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch(url, data, config);
    return response.data;
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
    return response.data;
  }
};


export default api;