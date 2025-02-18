import axios from 'axios';

const api = axios.create({
  baseURL: 'https://6727111d302d03037e6f3df4.mockapi.io/',
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