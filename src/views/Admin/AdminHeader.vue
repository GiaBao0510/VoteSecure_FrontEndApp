<!-- AdminHeader.vue -->
<template>
  <div class="vw-100 mt-5">
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
              <span class="me-2"> Admin </span>
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
                <a class="dropdown-item text-danger" href="#">
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
  export default {
    name: 'AdminHeader',
    data() {
      return {
        adminName: 'Admin Name',
      }
    }
  }
  </script>