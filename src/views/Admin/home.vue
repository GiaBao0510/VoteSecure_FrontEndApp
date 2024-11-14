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

                    <!-- >>>>>>>>>>>> Phản hồi <<<<<<<<<<<<< -->
                <template v-else-if="index === 9">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="togglePhanHoi"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathFeedback"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="phanHoiOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của phản hồi -->
                  <ul class="nav flex-column ms-3" v-if="phanHoiOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(63)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phản hồi cử tri</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(64)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phản hồi ứng cử viên</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(65)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phản hồi cán bộ</span>
                      </a>
                    </li>
                  </ul>
                </template>

                    <!-- >>>>>>>>>>>> DAnh mục liên quan đến phiếu bầu <<<<<<<<<<<<< -->
                <template v-else-if="index === 10">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="togglePhieuBau"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathVote"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="phieuBauOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của phiếu bầu -->
                  <ul class="nav flex-column ms-3" v-if="phieuBauOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(66)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phiếu bầu mã hóa theo năm</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(67)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phiếu bầu mã hóa thời điểm</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(68)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách phiếu bầu giải mã thời điểm</span>
                      </a>
                    </li>
                  </ul>
                </template>

                    <!-- >>>>>>>>>>>> Kỳ bầu cử <<<<<<<<<<<<< -->
                <template v-else-if="index === 1">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="toggleKyBauCu"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathCalendar"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="kyBauCuOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của kỳ bầu cử -->
                  <ul class="nav flex-column ms-3" v-if="kyBauCuOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(69)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách kỳ bầu cử</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(70)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách chi tiết kỳ bầu cử</span>
                      </a>
                    </li>
                  </ul>
                </template>

                    <!-- >>>>>>>>>>>> Người dùng <<<<<<<<<<<<< -->
                    <template v-else-if="index === 11">
                  <a
                    href="#"
                    class="nav-link px-3 text-white d-flex justify-content-between align-items-center"
                    @click.prevent="toggleNguoiDung"
                  >
                    <span>
                      <i :class="item.icon"></i>
                      <svg-icon type="mdi" :path="pathUser"></svg-icon>
                      <span class="ms-1 d-none d-sm-inline">{{ item.title }}</span>
                    </span>
                    <i :class="nguoiDungOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </a>
                  <!-- Mục con của người dùng -->
                  <ul class="nav flex-column ms-3" v-if="nguoiDungOpen">
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white" @click.prevent="ChonMucHienThi(71)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách cử tri</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(72)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách ứng cử viên</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a href="#" class="nav-link px-3 text-white"@click.prevent="ChonMucHienThi(73)">
                        <i class="bi bi-dot"></i>
                        <span class="ms-1 d-none d-sm-inline">Danh sách cán bộ</span>
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
                <statistical :ComponnetName="'Thống kê'"/>
              </div>
                <!-- >>>>>>>>>>>>>Phần này dành cho kỳ bầu cử <<<<<<<<<<<<<<<<< -->
              <div v-if="mucHienThi === 69">
                <elections :ComponnetName="'Danh sách các kỳ bầu cử'"/>
              </div>
              <div v-if="mucHienThi === 70">
                <GetDetailsListOfElectionBassedOnYear :ComponnetName="'Danh sách chi tiết các kỳ bầu cử trong năm'"/>
              </div>
                <!--------------------------------------------------------------->
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

                  <!------------ Phần này của phản hồi ----------->
              <div v-if="mucHienThi === 63">
                <feedbackVoter :ComponnetName="'Danh sách phản hồi cử tri'"/>
              </div>
              <div v-if="mucHienThi === 64">
                <feedbackCandidate :ComponnetName="'Danh sách phản hồi ứng cử viên'"/>
              </div>
              <div v-if="mucHienThi === 65">
                <feedbackCadre :ComponnetName="'Danh sách phản hồi cán bộ'"/>
              </div>
                  <!------------------------------------->
                  <!------------ Phần này  thuộc về phiếu bầu ----------->
              <div v-if="mucHienThi === 66">
                <GetDetailedEncryptedVotesBasedOnElectionYear :ComponnetName="'Danh sách phiếu bầu mã hóa theo năm'"/>
              </div>
              <div v-if="mucHienThi === 67">
                <EncryptedVotesBasedOnElectionDate 
                    :ComponnetName="'Danh sách phiếu bầu mã hóa theo thời điểm'"
                    :ngayBatDauDuocNhan="$route.query.ngayBD"
                />
              </div>
              <div v-if="mucHienThi === 68">
                <GetListOfDecodedVotesBasedOnElectionDate 
                :ComponnetName="'Danh sách phiếu bầu giải mã theo thời điểm'"
                />
              </div>
                  <!------------------------------------->
                  <!------------ Phần này  thuộc về người dùng ----------->
              <div v-if="mucHienThi === 71">
                <voters :ComponnetName="'Danh sách cử tri'"/>
              </div>
              <div v-if="mucHienThi === 72">
                <candidates :ComponnetName="'Danh sách ứng cử viên'"/>
              </div>
              <div v-if="mucHienThi === 73">
                <cadres :ComponnetName="'Danh sách cán bộ'"/>
              </div>
                  <!------------------------------------->
              
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
  import GetDetailsListOfElectionBassedOnYear from './elections/GetDetailsListOfElectionBassedOnYear.vue';
  import roles from './roles/roles.vue';
  import loginHistory from './loginHistory/loginHistoryList.vue';
  import votersLoginHistory from './loginHistory/voterLoginHistoryList.vue';
  import candidatesLoginHistory from './loginHistory/candidateLoginHistoryList.vue';
  import cadreLoginHistoryList from './loginHistory/cadreLoginHistoryList.vue';
  import constituencies from './constituencies/constituencies.vue';
  import feedbackVoter from './Feedback/getVoterFeedbackList.vue';
  import feedbackCadre from './Feedback/getCadreFeedbackList.vue';
  import feedbackCandidate from './Feedback/getCandidateFeedbackList.vue';
  import voters from './voters/voters.vue';
  import statistical from './statistical/statistical.vue';
  import candidates from './candidates/candidates.vue';
  import cadres from './cadres/cadres.vue';
  import boards from './boards/boards.vue'; 
  import province from './provinces/provinces.vue';
  import district from './districts/districts.vue';
  import listOfPositions from './listOfPositions/listOfPosition.vue';
  import GetDetailedEncryptedVotesBasedOnElectionYear from './votes/GetDetailedInformationAboutEncryptedVotesBasedOnElectionYear.vue';
  import EncryptedVotesBasedOnElectionDate from './votes/GetDetailsAboutEncryptedVotesBasedOnElectionDate.vue';
  import GetListOfDecodedVotesBasedOnElectionDate from './votes/GetListOfDecodedVotesBasedOnElectionDate.vue';
  import authService from '../../services/auth.service';
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiMenu, mdiHistory,mdiCommentAccount, 
    mdiVoteOutline, mdiCalendarSync ,mdiAccountMultipleOutline    } from '@mdi/js';
  
export default {
  components: {
    AdminHeader,
    elections, GetDetailsListOfElectionBassedOnYear,
    SvgIcon,
    roles,
    constituencies,
    loginHistory,
    votersLoginHistory, candidatesLoginHistory, cadreLoginHistoryList,
    listOfPositions,
    boards,
    province,
    district,
    feedbackVoter, feedbackCadre, feedbackCandidate,
    GetDetailedEncryptedVotesBasedOnElectionYear, EncryptedVotesBasedOnElectionDate,
    GetListOfDecodedVotesBasedOnElectionDate,
    voters, candidates, cadres,
    statistical
  },
  data() {
    return {
      mucHienThi: 0,
      isMobileSidebar: false,
      pathMenu: mdiMenu, // Thêm dòng này
      pathHistory: mdiHistory, // Thêm dòng này
      pathFeedback: mdiCommentAccount, // Thêm dòng này
      pathVote: mdiVoteOutline, // Thêm dòng này
      pathCalendar: mdiCalendarSync, // Thêm dòng này
      pathUser: mdiAccountMultipleOutline, // Thêm dòng này
      lichSuDangNhapOpen: false,
      phanHoiOpen: false,
      phieuBauOpen: false,
      kyBauCuOpen: false,
      nguoiDungOpen: false,
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
        { title: 'Phiếu bầu', icon: 'bi bi-bookmark' },    //10
        { title: 'Người dùng', icon: 'bi bi-bookmark' },
        { title: 'Công tác cán bộ', icon: 'bi bi-bookmark' },
        //{ title: 'Sách đã mượn', icon: 'bi bi-bookmark' },
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
      if (index !== 9) {
        this.phanHoiOpen = false;
      }
      if (index !== 10) {
        this.phieuBauOpen = false;
      }
      if(index !== 1){
        this.kyBauCuOpen = false;
      }
      if(index!== 11){
        this.nguoiDungOpen = false;
      }

      // Đóng sidebar mobile sau khi chọn mục
      if (this.isMobileSidebar) {
        this.toggleSidebar()
      }
    },
    toggleLichSuDangNhap() {
      this.lichSuDangNhapOpen = !this.lichSuDangNhapOpen;
    },
    togglePhanHoi() {
      this.phanHoiOpen = !this.phanHoiOpen;
    },
    togglePhieuBau() {
      this.phieuBauOpen = !this.phieuBauOpen;
    },
    toggleKyBauCu() {
      this.kyBauCuOpen =!this.kyBauCuOpen;
    },
    toggleNguoiDung() {
      this.nguoiDungOpen = !this.nguoiDungOpen;
    },
    // Đóng sidebar mobile khi click ngoài
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
  @import url('../../assets/ThuVien/home.css');
</style> 