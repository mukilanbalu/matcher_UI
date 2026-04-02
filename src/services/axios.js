// import axios from "axios";


// const axiosClient = axios.create({
//     baseURL: import.meta.env.VITE_API_ENDPOINT,
//     timeout: 50000,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// }
// );


// // Request interceptor to add token to headers
// axiosClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );


// // Response interceptor to handle errors globally
// // axiosInstance.interceptors.response.use(
// //     (response) => response,
// //     (error) => {
// //         const { response } = error;
// //         if (response) {
// //             switch (response.status) {
// //                 case 401:
// //                     // Handle unauthorized errors (e.g., redirect to login)
// //                     // window.location.href = '/login';
// //                     break;
// //                 case 403:
// //                     // Handle forbidden errors
// //                     console.error('Forbidden:', response.data);
// //                     break;
// //                 case 404:
// //                     // Handle not found errors
// //                     console.error('Not Found:', response.data);
// //                     break;
// //                 case 500:
// //                     // Handle internal server errors
// //                     console.error('Internal Server Error:', response.data);
// //                     break;
// //                 default:
// //                     console.error('Error:', response.data);
// //             }
// //         } else {
// //             console.error('Error:', error.message);
// //         }
// //         return Promise.reject(error);
// //     }
// // );

// // Store cancel tokens
// const cancelTokens = {};

// // Function to generate a cancel token and store it
// const createCancelToken = (key) => {
//     if (cancelTokens[key]) {
//         cancelTokens[key].cancel('Request canceled due to new request.');
//     }
//     cancelTokens[key] = axios.CancelToken.source();
//     return cancelTokens[key].token;
// };

// // Handle errors globally
// const handleError = (error) => {
//     if (error.response) {
//         console.error('Error Response:', error.response.data);
//     } else if (error.request) {
//         console.error('Error Request:', error.request);
//     } else {
//         console.error('Error Message:', error.message);
//     }
//     throw error;
// };

// const apiService = {
//     get: (url, config = {}) => {
//         config.cancelToken = createCancelToken('get' + url);
//         return axiosClient.get(url, config).catch(handleError);
//     },
//     post: (url, data, config = {}) => {
//         config.cancelToken = createCancelToken('post' + url);
//         return axiosClient.post(url, data, config).catch(handleError);
//     },
//     put: (url, data, config = {}) => {
//         config.cancelToken = createCancelToken('put' + url);
//         return axiosClient.put(url, data, config).catch(handleError);
//     },
//     patch: (url, data, config = {}) => {
//         config.cancelToken = createCancelToken('patch' + url);
//         return axiosClient.patch(url, data, config).catch(handleError);
//     },
//     delete: (url, config = {}) => {
//         config.cancelToken = createCancelToken('delete' + url);
//         return axiosClient.delete(url, config).catch(handleError);
//     },
// };



// export default apiService;



import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

// Response interceptor to handle and extract data globally
// axiosClient.interceptors.response.use(
//     (response) => {
//         if (response.status === 200 && response.data) {
//             return response; // Assuming the actual data is inside `data` key of the response
//         }
//         return Promise.reject(new Error('Unexpected response structure'));
//     },
//     (error) => {
//         if (axios.isCancel(error)) {
//             console.warn('Request canceled:', error.message);
//         } else if (error.response) {
//             const { status, data } = error.response;
//             switch (status) {
//                 case 400:
//                     console.error('Bad Request:', data.message || data);
//                     break;
//                 case 401:
//                     console.error('Unauthorized:', data.message || data);
//                     // Optionally, redirect to login or refresh token
//                     // window.location.href = '/login';
//                     break;
//                 case 403:
//                     console.error('Forbidden:', data.message || data);
//                     break;
//                 case 404:
//                     console.error('Not Found:', data.message || data);
//                     break;
//                 case 500:
//                     console.error('Internal Server Error:', data.message || data);
//                     break;
//                 default:
//                     console.error('Error:', data.message || data);
//             }
//         } else if (error.request) {
//             console.error('No response received:', error.request);
//         } else {
//             console.error('Error Message:', error.message);
//         }
//         return Promise.reject(error);
//     }
// );

// Store cancel tokens
const cancelTokens = {};

// Function to generate a cancel token and store it
const createCancelToken = (key) => {
    if (cancelTokens[key]) {
        cancelTokens[key].cancel('Request canceled due to new request.');
    }
    cancelTokens[key] = axios.CancelToken.source();
    return cancelTokens[key].token;
};

const apiService = {
    get: (url, config = {}) => {
        config.cancelToken = createCancelToken('get' + url);
        return axiosClient.get(url, config);
    },
    post: (url, data, config = {}) => {
        config.cancelToken = createCancelToken('post' + url);
        return axiosClient.post(url, data, config);
    },
    put: (url, data, config = {}) => {
        config.cancelToken = createCancelToken('put' + url);
        return axiosClient.put(url, data, config);
    },
    patch: (url, data, config = {}) => {
        config.cancelToken = createCancelToken('patch' + url);
        return axiosClient.patch(url, data, config);
    },
    delete: (url, config = {}) => {
        config.cancelToken = createCancelToken('delete' + url);
        return axiosClient.delete(url, config);
    },
};

export default apiService;
