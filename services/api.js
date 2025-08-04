import axios from "axios"; 

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // For debugging

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

// Thêm interceptor để log requests (để debug)
api.interceptors.request.use(request => {
    console.log('Starting Request:', request.url);
    console.log('Request Config:', request.baseURL);
    return request;
});

// Thêm interceptor để log responses (để debug)
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

export default api;