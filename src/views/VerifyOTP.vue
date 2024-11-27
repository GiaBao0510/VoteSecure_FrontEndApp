<template>
    <div class="container-fluid px-4 min-vh-100 min-vw-100 bg-primary">
      <div class="row g-0 min-vh-100">
        <div class="col-md-6 d-flex align-items-center justify-content-center py-4" >
            <img src="../assets/img/verify-otp.png" 
            alt="" 
            class="img-fluid mx-auto d-block"
            />
        </div>
        <div class="col-md-6 d-flex justify-content-center align-items-center vh-100">
            <div class="card p-4 shadow vw-100">
                <h2 class="text-center mb-4">OTP Verification</h2>
                <p class="text-center">Enter OTP Code sent to ****</p>
                
                <div class="d-flex justify-content-between mb-3">
                    <input v-for="(digit, index) in otpInputs"
                            :key="index"
                            v-model="otp[index]"
                            maxlength="1"
                            @input="focusNext(index)"
                            class="form-control text-center mx-1"
                            style="width: 48px; height: 48px;"
                            :ref="'otp' + index"/>
                </div>
                
                <button @click="verifyOtp" class="btn btn-primary btn-block">Verify & Proceed</button>
                <p class="text-center mt-3">
                    Didn't receive OTP code? 
                    <span @click="resendOtp" class="text-primary" style="cursor: pointer;">Resend Code</span>
                </p>
                
                <p v-if="errorMessage" class="text-danger text-center mt-2">{{ errorMessage }}</p>
            </div>
        </div>
      </div>
        
    </div>
</template>
  
  <script>
  import api from '../services/api.service';
  import Swal from 'sweetalert2';
  import Loading from './Loading.vue';
  import authService from '../services/auth.service';
  import Cookies from 'js-cookie';

  export default {
    name: 'OtpVerification',
    components: {
        Loading,
    },
    data() {
      return {
        otp: ['', '', '', '', '', ''], // For 6-digit OTP
        errorMessage: '',
        accessToken: null, refreshToken: null
      };
    },
    created(){
      this.accessToken = authService.getAccessTokenFromCookie();
      this.refreshToken = authService.getRefreshTokenFromCookie();
    },
    computed: {
      otpInputs() {
        return new Array(6).fill(''); // For 6 OTP input fields
      }
    },
    methods: {
      async verifyOtp() {
          console.log('Cookies library:', Cookies);

          //Kiem tra xem đã điền đủ 6 ô chưa
          const otpCode = this.otp.join('');
          if (otpCode.length !== 6) {
              this.errorMessage = 'Vui lòng nhập đủ 6 số.';
              return;
          }

          // 1. Trước tiên, tạo hàm utility để kiểm tra và set cookie an toàn
          const setSecureCookie = (name, value, options = {}) => {
            try {
              // Kiểm tra môi trường
              const isLocalhost = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1';
              
              // Cấu hình cookie cơ bản cho localhost
              const cookieOptions = {
                path: '/',
                sameSite: isLocalhost ? 'Lax' : 'Strict',
                secure: !isLocalhost, // false on localhost
                expires: options.expires || new Date(Date.now() + 86400000), // 1 day default
                domain: isLocalhost ? 'localhost' : window.location.hostname
              };

              // Set cookie
              Cookies.set(name, value, cookieOptions);
              
              // Verify immediately
              return Cookies.get(name) === value;
            } catch (error) {
              console.error(`Error setting cookie ${name}:`, error);
              return false;
            }
          };
          
          try {
            //Gửi thông tin
            const response = await api.post('/api/Account/verify-otp-after-login', {
              Email: localStorage.getItem('Email'),
              Phone: localStorage.getItem('Phone'),
              Otp: otpCode.toString()
            });
              
            //Xác thực thành công
            if (response.status === 200 && response.data.success) {

              console.log("Login response:", response.data);
              console.log("All cookies:", document.cookie);
              console.log("Access token:", authService.getAccessTokenFromCookie());
              const {accessToken, refreshToken} = response.data.data;

              // Set tokens using auth service
              const tokensSet = authService.setTokenCokies(accessToken, refreshToken);
              console.log('Tokens set:', tokensSet);

              // Xác thực token khi đặt
              const savedAccessToken = authService.getAccessTokenFromCookie();
              const savedRefreshToken = authService.getRefreshTokenFromCookie();
              
              if (!savedAccessToken || !savedRefreshToken) {
                  throw new Error('Failed to save authentication tokens');
              }
      
              // Thử set cookie với function mới
              const accessTokenSet = setSecureCookie('accessToken', accessToken, {
                expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
              });
              
              const refreshTokenSet = setSecureCookie('refreshToken', refreshToken, {
                expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
              });

              // Log trạng thái
              console.log('Cookie set status:', {
                accessToken: accessTokenSet,
                refreshToken: refreshTokenSet,
                accessTokenValue: Cookies.get('accessToken'),
                refreshTokenValue: Cookies.get('refreshToken')
              });

              // Nếu không set được cookie, lưu vào localStorage
              if (!accessTokenSet || !refreshTokenSet) {
                console.warn('Falling back to localStorage storage');
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
              }

              // Thông báo thành công và chuyển hướng
              await Swal.fire({
                icon: 'success',
                title: 'Xác thực thành công',
                text: response.data.message,
                confirmButtonText: 'Đóng'
              });

              await this.$router.push('/admin');
              
            } else if(response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Xác thực thất bại',
                    text: response.data.message,
                    confirmButtonText: 'Đóng'
                });
            }
          } catch (error) {
            // Thêm log chi tiết về error
            console.error('Full error object:', error);
            console.error('Message error object:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            // Xử lý lỗi HTTP 400
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Xác thực thất bại',
                    text: error.response.data.message || 'Mã OTP không chính xác',
                    confirmButtonText: 'Đóng'
                });
            } else {
                this.errorMessage = 'An error occurred while verifying OTP. Please try again later.';
                console.error('OTP verification error:', error);
            }
          }
      },

      focusNext(index) {
          if (this.otp[index] && index < this.otp.length - 1) {
              this.$refs[`otp${index + 1}`][0].focus();
          }
      },

      async resendOtp() {
          try {
              const response = await api.post('/api/Account/resend-otp', {
                  Email: localStorage.getItem('Email'),
              });
              
              if (response.status === 200) {
                  Swal.fire({
                      position: "top-center",
                      icon: "success",
                      title: "Đã gửi lại mã OTP qua mail",
                      showConfirmButton: false,
                      timer: 1500
                  });
              }
          } catch (error) {
              Swal.fire({
                  icon: 'error',
                  title: 'Gửi mã OTP thất bại',
                  text: 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.',
                  confirmButtonText: 'Đóng'
              });
          }
      }
  }
  };
  </script>
  
  <style scoped>
    @import url('../assets/ThuVien/shared.css');
  </style>
  