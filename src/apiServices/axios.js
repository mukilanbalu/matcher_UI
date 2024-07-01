import axios from "axios";


const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "
    }
}
);


// Request interceptor to add token to headers
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Response interceptor to handle errors globally
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const { response } = error;
//         if (response) {
//             switch (response.status) {
//                 case 401:
//                     // Handle unauthorized errors (e.g., redirect to login)
//                     // window.location.href = '/login';
//                     break;
//                 case 403:
//                     // Handle forbidden errors
//                     console.error('Forbidden:', response.data);
//                     break;
//                 case 404:
//                     // Handle not found errors
//                     console.error('Not Found:', response.data);
//                     break;
//                 case 500:
//                     // Handle internal server errors
//                     console.error('Internal Server Error:', response.data);
//                     break;
//                 default:
//                     console.error('Error:', response.data);
//             }
//         } else {
//             console.error('Error:', error.message);
//         }
//         return Promise.reject(error);
//     }
// );

const apiService = {
    get: (url, config) => axiosClient.get(url, config).catch(handleError),
    post: (url, data, config) => axiosClient.post(url, data, config).catch(handleError),
    put: (url, data, config) => axiosClient.put(url, data, config).catch(handleError),
    patch: (url, data, config) => axiosClient.patch(url, data, config).catch(handleError),
    delete: (url, config) => axiosClient.delete(url, config).catch(handleError),
};

const handleError = (error) => {
    if (error.response) {
        console.error('Error Response:', error.response.data);
    } else if (error.request) {
        console.error('Error Request:', error.request);
    } else {
        console.error('Error Message:', error.message);
    }
    throw error;
};

export default apiService;