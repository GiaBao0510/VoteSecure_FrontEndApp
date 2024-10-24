<script>
import api from '../services/api.service';
import authService from '@/services/auth.service';
import Swal from 'sweetalert2';
import FormLogin from '@/components/forms/FormLogin.vue';
import { useRouter } from 'vue-router';
import Loading from './Loading.vue';

export default {
    name: 'Login',
    components: {
        FormLogin,
        Loading     //Đăng ký component
    },
    data() {
        return {
            loginInformation: {
                account: '',
                password: ''
            },
            isLoading: false  // Biến trạng thái để kiểm soát việc hiển thị loading
        };
    },
    async created() {
        // Kiểm tra token khi component được tạo
        const accessToken = authService.getAccessTokenFromCookie();
        if (accessToken && authService.isTokenValid(accessToken)) {
            // Nếu token còn hạn thì chuyển đến trang admin
            this.$router.push('/homeAdmin');
        }
    },
    methods: {
        async handleLoginSubmit(loginData) {
            if (!loginData.account || !loginData.password) {
                console.log('Missing login data');
                return;
            }
            this.isLoading = true;
            try {
                // Kiểm tra response từ server
                const response = await api.post('/api/Account/login', {
                    account: loginData.account,
                    password: loginData.password
                });

                //Nếu đăng nhập thành công
                if (response.status === 200 && response.data.success && response.data.vaiTro === "1") {
                    // Chuyển đến trang xác thực OTP
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công',
                        text: response.data.message ,
                        confirmButtonText: 'Đóng'
                    });
                    localStorage.setItem('Email',response.data.email);
                    localStorage.setItem('Phone',loginData.account);
                    this.$router.push('/verify-otp');

                } else {
                    // Hiển thị thông báo lỗi
                    Swal.fire({
                        icon: 'error',
                        title: 'Đăng nhập thất bại',
                        text: response.data.message || 'Vui lòng kiểm tra lại thông tin đăng nhập',
                        confirmButtonText: 'Đóng'
                    });
                }
            } catch (error) {
                console.error('Login error:', error);
                // Xử lý các lỗi HTTP (400, 401, 404, etc.)
                const errorMessage = error.response?.data?.message 
                    || error.response?.statusText 
                    || error.message 
                    || 'Đã có lỗi xảy ra khi đăng nhập';
                // Xử lý lỗi từ server
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: errorMessage,
                    confirmButtonText: 'Đóng'
                });
            }finally {
                this.isLoading = false; //Ẩn loading
            }
        }
    }
};
</script>

<template>
    <div class="login-container">
        <FormLogin 
            @submit:loginInformation="handleLoginSubmit"
            :loginInformation="loginInformation"
        />
        <Loading v-if="isLoading" />  <!-- Hiển thị loading khi isLoading = true -->
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    padding: 2vw 3vw 3vw 3vw;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    background: linear-gradient(to right, #1c6fec, #0c43f5);
    background-size: cover;
}

.login-container > * {
    max-width: 100%;
    max-height: 100%;
    box-sizing: border-box;
}
</style>