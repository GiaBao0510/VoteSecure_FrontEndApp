<template>
  <div class="min-vh-100 bg-light">
    <!-- Header -->
    <AdminHeader />

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div 
          :class="[
            'sidebar-container', 
            'bg-dark', 
            isMobileSidebar ? 'mobile-sidebar' : 'col-auto px-0 min-vh-100'
          ]"
        >
          <div 
            class="sidebar-toggle" 
            @click="toggleSidebar"
          >
            <i :class="isMobileSidebar ? 'bi bi-x-lg' : 'bi bi-list'"></i>
            <svg-icon type="mdi" :path="path"></svg-icon>
          </div>
          
          <div 
            :class="[
              'd-flex', 
              'flex-column', 
              'align-items-center', 
              'align-items-sm-start', 
              'px-3', 
              'pt-2', 
              'text-white', 
              'min-vh-100',
              {'sidebar-menu': isMobileSidebar}
            ]"
          >
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100" id="menu">
              <li class="nav-item w-100" v-for="(item, index) in menuItems" :key="index">
                <a 
                  href="#" 
                  class="nav-link px-3 text-white" 
                  :class="{ 'active': mucHienThi === index }"
                  @click.prevent="ChonMucHienThi(index)"
                >
                  <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Main Content -->
        <div :class="['col', 'p-4', 'bg-light',  {'main-content-shifted': isMobileSidebar} ]">
          <div class="card shadow-sm overflow-scroll" style="max-height: 90vh;">
            <div class="card-body">
              <div v-if="mucHienThi === 0">
                <p>null 0</p>
              </div>
              <div v-if="mucHienThi === 1">
                <elections :ComponnetName="'Các kỳ bầu cử'" />
              </div>
              <div v-if="mucHienThi === 2">
                <roles :ComponnetName="'Các vai trò'"/>
              </div>
              <div v-if="mucHienThi === 3">
                <p>null 3</p>
              </div>
              <div v-if="mucHienThi === 4">
                <p>null 4</p>
              </div>
              <div v-if="mucHienThi === 5">
                <p>null 5</p>
              </div>
              <div v-if="mucHienThi === 6">
                <p>null 6</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import AdminHeader from './AdminHeader.vue';
import elections from './elections/elections.vue';
import roles from './roles/roles.vue';
import authService from '../../services/auth.service';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu } from '@mdi/js';
  
export default {
  components: {
    AdminHeader,
    elections,
    SvgIcon,
    roles,
  },
  data() {
    return {
      mucHienThi: 0,
      isMobileSidebar: false,
      path: mdiMenu,
      menuItems: [
        { title: 'Thống kê', icon: 'bi bi-graph-up' },
        { title: 'Kỳ bầu cử', icon: 'bi bi-book' },
        { title: 'Vai trò', icon: 'bi bi-people' },
        { title: 'Người dùng', icon: 'bi bi-person' },
        { title: 'Tác giả', icon: 'bi bi-pen' },
        { title: 'Nhà xuất bản', icon: 'bi bi-building' },
        { title: 'Sách đã mượn', icon: 'bi bi-bookmark' },
      ]
    }
  },
  methods: {
    ChonMucHienThi(index) {
      this.mucHienThi = index
      // Đóng sidebar mobile sau khi chọn mục
      if (this.isMobileSidebar) {
        this.toggleSidebar()
      }
    },
    toggleSidebar() {
      this.isMobileSidebar = !this.isMobileSidebar
    },
    // Đóng sidebar mobile khi click ngoài
    handleOutsideClick(event) {
      if (
        this.isMobileSidebar && 
        !event.target.closest('.sidebar-container') && 
        !event.target.closest('.sidebar-toggle')
      ) {
        this.isMobileSidebar = false
      }
    },
    //Kiểm tra token khi component được tạo
    checkToken(){
      const accessToken = authService.getAccessTokenFromCookie() || localStorage.getItem('accessToken');
      if(!accessToken || !authService.isTokenValid(accessToken) ){
        this.$router.push('/');
      }
    }
  },
  mounted() {
    this.checkToken(); // Kiểm tra token khi component được tạo
    
    // Thêm sự kiện click toàn cục để đóng sidebar mobile
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    // Gỡ bỏ sự kiện click khi component bị hủy
    document.removeEventListener('click', this.handleOutsideClick)
  }
}
</script>
  
<style scoped>
/* Minimal custom CSS */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
  
.nav-link.active {
  background-color: #0d6efd !important;
}
  
.cursor-pointer {
  cursor: pointer;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1050;
  color: white;
  background-color: #0d6efd;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .sidebar-toggle {
    display: block;
  }

  .sidebar-container {
    position: fixed;
    top: 0;
    left: -250px;
    width: 250px;
    height: 100vh;
    transition: left 0.3s ease;
    z-index: 1040;
  }

  .mobile-sidebar {
    left: 0;
  }

  .mobile-sidebar .sidebar-menu {
    display: block !important;
  }

  .main-content-shifted {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>