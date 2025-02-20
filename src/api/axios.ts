import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  // handle before request is sent
  return config;
}, (error) => {
  // handle request error
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
     // handle response data
     return response;
    }, (error) => {
      // handle response un-authen error
    //   if (error.response.status === 401) {
    //     navigate("/");
    //   }
      return Promise.reject(error);
    });


export default api;