import { jwtDecode } from "jwt-decode";
import api from './api.service';
import 'js-cookie';

function getAccessTokenFromCookie() {
    const name = "accessToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null; // Trả về null nếu không tìm thấy cookie
  }
  
  function getRefreshTokenFromCookie() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("refreshToken=")) {
        return cookie.substring("refreshToken=".length, cookie.length);
      }
    }
    return null; // Trả về null nếu không tìm thấy cookie
  }

//Làm mới token
function refreshToken(){
    const refreshToken = getRefreshTokenFromCookie(); //Lấy refresh token kiểm tra xem còn hạn không
    if(refreshToken){
        return api.post('/api/Account/renewtoken', {refreshToken})
            .then((response) => {
                const newAccessToken = response.data
                document.cookie = `accessToken=${newAccessToken}; path=/; max-age=3600; secure;`;
                return {newAccessToken};
            })
            .catch((error) =>{
                console.error('Error refreshing token:', error.message);
                throw error;
            });
    }else{
        return Promise.reject(new Error('No refreshToken found.'));
    }
};

//Kiểm tra thời hạn của token
function isTokenValid(token){
    if(!token) return false;
    try{
        const dedcode = jwtDecode(token);
        const currentTime = Date.now()/1000; //Thời gian hiện tại
        return dedcode.exp > currentTime; //Nếu thời gian hạn của token đã qua thì trả về false
    }catch(error){
        return false;
    }
}

//Lấy vai trò người dùng sao khi giải mã token
function getUserRole(){
    const token = getAccessTokenFromCookie();
    console.log('Token to decode: ', token);
    if(!token) return null;
    try{
        const decoded = jwtDecode(token);
        console.log('Decoded token: ', decoded);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    }catch(e){
        console.error('Error decoding tokens: ',e);
        return null;
    }
}

//Thiết lập token tùy chỉnh
function setTokenCokies(accessToken, refreshToken){
    // Bỏ thuộc tính secure khi chạy localhost
    console.log('Setting accesstoken cookies');
    const cookieStringAccess = `accessToken=${accessToken}; path=/; max-age=3600; samesite=strict`;
    const cookieStringRefresh = `refreshToken=${refreshToken}; path=/; max-age=86400; samesite=strict`;

    Cookie.set('accessToken', cookieStringAccess);
    Cookie.set('refreshToken', cookieStringRefresh);
    console.log('>> AccessToken cookie:', Cookies.get('accessToken'));
    console.log('>> refreshToken cookie :', Cookies.get('refreshToken'));
    
}

//Lấy tên token từ cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export default{
    setTokenCokies,
    getAccessTokenFromCookie,
    getRefreshTokenFromCookie,
    refreshToken,
    isTokenValid,
    getUserRole,
    getCookie
};