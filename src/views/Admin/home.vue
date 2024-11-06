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
            isMobileSidebar ? 'mobile-sidebar' : 'col-auto px-0 min-vh-100',
          ]"
        >
          <div class="sidebar-toggle" @click="toggleSidebar">
            <i :class="isMobileSidebar ? 'bi bi-x-lg' : 'bi bi-list'"></i>
            <svg-icon type="mdi" :path="pathMenu"></svg-icon>
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
              { 'sidebar-menu': isMobileSidebar },
            ]"
          >
              <!-- >>>>>>>>>>>> Lịch sử đăng nhập <<<<<<<<<<<<< -->
            <ul
              class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
              id="menu"
            >
              <li class="nav-item w-100" v-for="(item, index) in menuItems" :key="index">
                <!-- Check if the current item is "Lịch sử đăng nhập" (index 4) -->
                <template v-if="index === 4">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="toggleLichSuDangNhap"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathHistory"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="lichSuDangNhapOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của lích sử đăng nhập -->
                  <ul class="nav flex-column ms-3" v-if="lichSuDangNhapOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(59)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(60)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập cử tri</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(61)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập ứng cử viên</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(62)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập cán bộ</span>
                      </a>
                    </li>
                  </ul>
                </template>

                <!-- Regular menu items -->
                <template v-else>
                  <a
                    href="#"
                    class="nav-link px-3 text-white"
                    :class="{ active: mucHienThi === index }"
                    @click.prevent="ChonMucHienThi(index)"
                  >
                    <i :class="item.icon"></i>
                    <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                  </a>
                </template>
              </li>
            </ul>
                    <!-- >>>>>>>>>>>> Phản hồi <<<<<<<<<<<<< -->
            <ul
              class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
              id="menu"
            >
              <li class="nav-item w-100" v-for="(item, index) in menuItems" :key="index">
                <template v-if="index === 4">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="toggleLichSuDangNhap"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathHistory"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="lichSuDangNhapOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của phản hồi -->
                  <ul class="nav flex-column ms-3" v-if="lichSuDangNhapOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(59)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phản hồi cử tri</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(60)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phản hồi ưunsg</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(61)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập ứng cử viên</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(62)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách lịch sử đăng nhập cán bộ</span>
                      </a>
                    </li>
                  </ul>
                </template>

                <!-- Regular menu items -->
                <template v-else>
                  <a
                    href="#"
                    class="nav-link px-3 text-white"
                    :class="{ active: mucHienThi === index }"
                    @click.prevent="ChonMucHienThi(index)"
                  >
                    <i :class="item.icon"></i>
                    <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                  </a>
                </template>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Main Content -->
        <div
          :class="[
            'col',
            'p-4',
            'bg-light',
            { 'main-content-shifted': isMobileSidebar },
          ]"
        >
          <div class="card shadow-sm overflow-scroll" style="max-height: 90vh;">
            <div class="card-body">
              <div v-if="mucHienThi === 0">
                <p>null 0</p>
              </div>
              <div v-if="mucHienThi === 1">
                <elections :ComponnetName="'Các kỳ bầu cử'" />
              </div>
              <div v-if="mucHienThi === 2">
                <roles :ComponnetName="'Các vai trò'" />
              </div>
              <div v-if="mucHienThi === 3">
                <constituencies :ComponnetName="'Các đơn vị bầu cử'" />
              </div>
                <!------------ Phần này của lịch sử đăng nhập ----------->
              <div v-if="mucHienThi === 59">
                <loginHistory :ComponnetName="'Danh sách lịch sử đăng nhập'"/>
              </div>
              <div v-if="mucHienThi === 60">
                <votersLoginHistory :ComponnetName="'Danh sách lịch sử đăng nhập cử tri'"/>
              </div>
              <div v-if="mucHienThi === 61">
                <candidatesLoginHistory :ComponnetName="'Danh sách lịch sử đăng nhập ứng cử viên'"/>
              </div>
              <div v-if="mucHienThi === 62">
                <cadreLoginHistoryList :ComponnetName="'Danh sách lịch sử đăng nhập cán bộ'"/>
              </div>
                <!------------------------------------->
              <div v-if="mucHienThi === 5">
                <listOfPositions :ComponnetName="'Danh mục ứng cử'" />
              </div>
              <div v-if="mucHienThi === 6">
                <boards :ComponnetName="'Các Ban'" />
              </div>
              <div v-if="mucHienThi === 7">
                <province :ComponnetName="'Các Tỉnh thành'" />
              </div>
              <div v-if="mucHienThi === 8">
                <district :ComponnetName="'Các Quận/Huyện'" />
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
  import loginHistory from './loginHistory/loginHistoryList.vue';
  import votersLoginHistory from './loginHistory/voterLoginHistoryList.vue';
  import candidatesLoginHistory from './loginHistory/candidateLoginHistoryList.vue';
  import cadreLoginHistoryList from './loginHistory/cadreLoginHistoryList.vue';
  import constituencies from './constituencies/constituencies.vue';
  import boards from './boards/boards.vue'; 
  import province from './provinces/provinces.vue';
  import district from './districts/districts.vue';
  import listOfPositions from './listOfPositions/listOfPosition.vue';
  import authService from '../../services/auth.service';
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiMenu, mdiHistory } from '@mdi/js';
  
export default {
  components: {
    AdminHeader,
    elections,
    SvgIcon,
    roles,
    constituencies,
    loginHistory,
    votersLoginHistory,
    candidatesLoginHistory,
    cadreLoginHistoryList,
    listOfPositions,
    boards,
    province,
    district,
  },
  data() {
    return {
      mucHienThi: 0,
      isMobileSidebar: false,
      pathMenu: mdiMenu, // Thêm dòng này
      pathHistory: mdiHistory, // Thêm dòng này
      lichSuDangNhapOpen: false,
      menuItems: [
        { title: 'Thống kê', icon: 'bi bi-graph-up' },        //0
        { title: 'Kỳ bầu cử', icon: 'bi bi-book' },   //1
        { title: 'Vai trò', icon: 'bi bi-people' },  //2
        { title: 'Đơn vị bầu cử', icon: 'bi bi-person' }, //3
        { title: 'Lịch sử đăng nhập', icon: 'bi bi-pen' },  
        { title: 'Danh mục ứng cử', icon: 'bi bi-building' }, //5
        { title: 'Ban', icon: 'bi bi-bookmark' },             //6
        { title: 'Tỉnh thành', icon: 'bi bi-bookmark' },      //7
        { title: 'Quận/Huyện', icon: 'bi bi-bookmark' },      //8
        { title: 'Phản hồi', icon: 'bi bi-bookmark' },        //9
        { title: 'Sách đã mượn', icon: 'bi bi-bookmark' },    //10
        { title: 'Sách đã mượn', icon: 'bi bi-bookmark' },
      ]
    }
  },
  methods: {
    ChonMucHienThi(index) {
      this.mucHienThi = index;
      //Đóng
      if (index !== 4) {
        this.lichSuDangNhapOpen = false;
      }
      // Đóng sidebar mobile sau khi chọn mục
      if (this.isMobileSidebar) {
        this.toggleSidebar()
      }
    },
    toggleLichSuDangNhap() {
      this.lichSuDangNhapOpen = !this.lichSuDangNhapOpen;
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

  /* Optional: Custom styles */
  .nav .nav {
    padding-left: 1rem;
  }

  .nav .nav .nav-link {
    font-size: 0.9rem;
  }

  .nav .nav .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  .nav .nav .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
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