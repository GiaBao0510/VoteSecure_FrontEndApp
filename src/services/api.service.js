import axios from "axios";
import authService from "./auth.service";
import router from "../router";

//Khởi tạo phiên Axios
const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
    },
    withCredentials: true // Quan trọng để gửi và nhận cookies
});

//Thêm Bearer token vào header khi có yêu cầu cần xác thực
api.interceptors.request.use(
    (config) =>{
        console.log('Request: ',config.baseURL);
        console.log('Header: ',config.headers);
        console.log('data: ',config.data);
        const accessToken = authService.getAccessTokenFromCookie() || localStorage.getItem('accessToken');
        console.log('>>> có yêu cầu accessToken: ',accessToken);
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

//Xử lý trường hợp 401 nếu AccessToken hết hạn thì gọi refreshToken để lấy AccessToken mới
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await authService.refreshToken();
                const config = error.config;
                config.headers.Authorization = `Bearer ${authService.getAccessTokenFromCookie()}`;
                return api.request(config);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                router.push({ name: 'login' }); // Vô trang đăng nhập
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

