<template>
  <div class="vw-100 mt-12">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <a class="btn btn-outline-primary" data-mdb-ripple-init data-mdb-ripple-color="dark" 
        href="home.vue">
          VoteSecure Admin
        </a>
        
        <div class="ms-auto d-flex align-items-center">
          <div class="dropdown">
            <div class="d-flex align-items-center cursor-pointer" data-bs-toggle="dropdown">
              <img 
                src="../../assets/img/AvartaAdmin.jpg"
                class="rounded-circle me-2 img-thumbnail vm-1" 
                style="width: 50px; height: 50px;"
                alt="Admin Avatar"
              />
              <span class="me-2">Admin</span>
              <i class="bi bi-chevron-down"></i>
            </div>
            
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-person me-2"></i>Thông tin cá nhân
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-gear me-2"></i>Cài đặt
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AdminHeader',
  data() {
    return {
      adminName: 'Admin'
    }
  },
  methods: {
    async handleLogout() {
      try {
        const result = await Swal.fire({
          title: 'Xác nhận đăng xuất',
          text: 'Bạn có chắc chắn muốn đăng xuất?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đăng xuất',
          cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
          // Clear cookies
          document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Navigate to login
          await this.$router.push({ name: 'Login' });
          
          Swal.fire(
            'Đã đăng xuất',
            'Đăng xuất thành công',
            'success'
          );
        }
      } catch (error) {
        console.error('Logout error:', error);
        Swal.fire(
          'Lỗi',
          'Có lỗi xảy ra khi đăng xuất',
          'error'
        );
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.dropdown-item {
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #dc3545;
  color: white !important;
}
</style>