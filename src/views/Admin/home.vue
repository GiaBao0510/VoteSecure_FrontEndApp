
  <template>
    <div class="min-vh-100 bg-light">
      <!-- Header -->
      <AdminHeader />

      <div class="container-fluid">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-auto px-0 bg-dark min-vh-100">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100" id="menu">
                <li class="nav-item w-100" v-for="(item, index) in menuItems" :key="index">
                  <a 
                    href="#" 
                    class="nav-link px-3 text-white" 
                    :class="{ 'active': mucHienThi === index }"
                    @click.prevent="ChonMucHienThi(index)"
                  >
                    <i :class="item.icon + ' me-2'"></i>
                    <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="col p-4 bg-light">
            <div class="card shadow-sm overflow-scroll" style="max-height: 90vh;">
              <div class="card-body">
                <div v-if="mucHienThi === 0">
                  <p>null 0</p>
                </div>
                <div v-if="mucHienThi === 1">
                  <elections />
                </div>
                <div v-if="mucHienThi === 2">
                  <p>null 2</p>
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
  
  export default {
    components: {
      AdminHeader,
      elections,
    },
    data() {
      return {
        mucHienThi: 0,
        menuItems: [
          { title: 'Thống kê', icon: 'bi bi-graph-up' },
          { title: 'Kỳ bầu cử', icon: 'bi bi-book' },
          { title: 'Nhân viên', icon: 'bi bi-people' },
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
      }
    }
  }
  console.log('AccessToken localStorage: ',localStorage.getItem('accessToken'));
  console.log('RefreshToken localStorage: ',localStorage.getItem('refreshToken'));
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
  </style>