<template>
    <v-container fluid>
      <!-- Tiêu đề -->
      <ComponnetTitle :ComponnetName="ComponnetName" />
  
      <!-- Năm và Search -->
      <div class="controls-container pa-4">
        <!-- Container cho controls -->
        <v-card flat class="mb-4">
            <v-container fluid>
                <v-row dense align="center">
                    <!-- Year Selector -->
                    <v-col cols="12" md="3" sm="6">
                        <YearSelector 
                        :selectedYear="YearSelected" 
                        @yearSelected="onYearSelected"
                        class="flex-grow-1" 
                        />
                    </v-col>

                    <!-- Search Field -->
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Tìm kiếm"
                        single-line
                        hide-details
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                        clearable
                        ></v-text-field>
                    </v-col>

                    <!-- Export Button -->
                    <v-col cols="12" md="3" sm="12">
                        <v-btn
                        color="warning"
                        prepend-icon="mdi-microsoft-excel"
                        @click="exportToExcel"
                        class="export-btn"
                        :block="$vuetify.display.smAndDown"
                        :height="40"
                        >
                        Export Excel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
  
      <!-- Loading Overlay -->
      <v-overlay :model-value="isLoading" class="align-center justify-center">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
  
      <!-- Danh sách dữ liệu -->
      <v-card>
        <v-list lines="two">
          <v-list-item
            v-for="(item, index) in filteredItems"
            :key="index"
            :value="item"
            class="mb-2"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                {{ index + 1 }}
              </v-avatar>
            </template>
  
            <v-list-item-title class="text-h6 mb-1">
              {{ item.tenKyBauCu }}
            </v-list-item-title>
  
            <v-list-item-subtitle>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div><strong>Mô tả:</strong> {{ item.moTa }}</div>
                  <div><strong>Cấp ứng cử:</strong> {{ item.tenCapUngCu }}</div>
                  <div><strong>Số lượng cử tri hiện tại:</strong> {{ item.soLuongCuTriHienTai }}</div>
                  <div><strong>Số lượng ứng cử viên hiện tại:</strong> {{ item.soLuongUngCuVienHienTai }}</div>
                  <div><strong>Số lượng cán bộ hiện tại:</strong> {{ item.soLuongCanBoHienTai }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div><strong>Thời gian:</strong> {{ formatDate(item.ngayBD) }} - {{ formatDate(item.ngayKT) }}</div>
                  <div><strong>Đơn vị bầu cử:</strong> {{ item.tenDonViBauCu }}</div>
                  <div><strong>Số lượng cử tri tối đa:</strong> {{ item.soLuongToiDaCuTri }}</div>
                  <div><strong>Số lượng ứng cử viên tối đa:</strong> {{ item.soLuongToiDaUngCuVien }}</div>
                  <div><strong>Số lượt bình chọn tối đa:</strong> {{ item.soLuotBinhChonToiDa }}</div>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
  
            <v-list-item-action class="action-container pa-2">
              <!-- Status Row -->
              <div class="d-flex justify-start mb-3">
                  <v-chip
                      :color="item.congBo === '1' ? 'success' : 'warning'"
                      size="small"
                  >
                      {{ item.congBo == '1' ? 'Đã công bố' : 'Chưa công bố' }}
                  </v-chip>
              </div>

              <!-- Scrollable Actions Container -->
              <div class="actions-scroll-container">
                  <div class="actions-wrapper">
                      <!-- Vote Management Group -->
                      <div class="button-group px-2">
                          <v-btn
                              color="primary"
                              @click="viewEncryptedVotes(item.ngayBD)"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-lock</v-icon>
                              Phiếu mã hóa
                          </v-btn>

                          <v-btn
                              color="primary"
                              variant="outlined"
                              @click="viewDecodedVotes(item.ngayBD)"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-lock-open</v-icon>
                              Phiếu giải mã
                          </v-btn>

                          <v-btn
                              color="primary"
                              @click="viewDecodedVotes(item.ngayBD)"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                              Ứng cử viên
                          </v-btn>
                      </div>

                      <!-- Divider -->
                      <v-divider vertical class="mx-2"></v-divider>

                      <!-- User Management Group -->
                      <div class="button-group px-2">
                          <v-btn
                              color="success"
                              @click="showNavigateForm(item.ngayBD, item.iD_DonViBauCu, item.iD_Cap,'voter')"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-account-plus</v-icon>
                              Thêm cử tri
                          </v-btn>

                          <v-btn
                              color="info"
                              @click="showNavigateForm(item.ngayBD, item.iD_DonViBauCu, item.iD_Cap, 'candidate')"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-account-tie</v-icon>
                              Thêm ứng viên
                          </v-btn>

                          <v-btn
                              color="warning"
                              @click="showNavigateForm(item.ngayBD, item.iD_DonViBauCu, item.iD_Cap, 'cadre')"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-account-cog</v-icon>
                              Thêm cán bộ
                          </v-btn>
                      </div>

                      <!-- Divider -->
                      <v-divider vertical class="mx-2"></v-divider>

                      <!-- Result Management -->
                      <div class="button-group px-2">
                          <v-btn
                              @click="AnnounceElectionResult(item.ngayBD,item.congBo)"
                              :color="item.congBo === '1' ? 'warning' : 'info'"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-bullhorn</v-icon>
                              Kết quả kỳ bầu cử
                          </v-btn>
                      </div>

                      <v-divider vertical class="mx-1"></v-divider>

                      <div class="button-group px-2">
                          <v-btn
                              @click="GetListOfUsersHaveNotVote(item.ngayBD,item.congBo)"
                              :color="item.congBo === '1' ? 'warning' : 'info'"
                              class="action-btn"
                              density="comfortable"
                          >
                              <v-icon size="small" class="mr-1">mdi-information</v-icon>
                              Danh sách các ứng cử viên chưa bỏ phiếu
                          </v-btn>
                      </div>
                  </div>
              </div>
          </v-list-item-action>
          </v-list-item>
        </v-list>
  
        <!-- Phân trang -->
        <v-pagination
          v-model="page"
          :length="numberOfPages"
          :total-visible="7"
          class="my-4"
        />
      </v-card>
    </v-container>

    <NavigateToElection
      v-model:show="showNavigateModal"
      :type="navigateType"
      :ngayBD="selectedNgayBD"
      :iD_DonViBauCu="selectedDonViBauCu"
      :iD_Cap="selectCapUngCu"
      :remainingCapacity="remainingCapacity"
      @refresh="handleNavigateSuccess"
    />
  </template>
  
  <script>
  import { format, parseISO } from 'date-fns';
  import * as XLSX from 'xlsx';
  import api from '@/services/api.service';
  import ComponnetTitle from '../ComponnetTitle.vue';
  import YearSelector from '@/components/common/yearSelector.vue';
  import EncryptedBallotList from '../votes/GetDetailedInformationAboutEncryptedVotesBasedOnElectionYear.vue';
  import Swal from "sweetalert2";
  import ListOfElectionsResultAnnounced from './ListOfElectionsResultAnnounced.vue';
  import GetListOfUsersWhoHaveNotVotedByElection from './GetListOfUsersWhoHaveNotVotedByElection.vue';
  import NavigateToElection from './NavigateToElection.vue';

  export default {
    name: 'ElectionList',
    components: {
      ComponnetTitle,
      YearSelector,
      EncryptedBallotList,
      NavigateToElection,
      ListOfElectionsResultAnnounced,
      GetListOfUsersWhoHaveNotVotedByElection
    },
    props: {
      ComponnetName: {
        type: String,
        default: 'Datas',
      },
    },
    data() {
      return {
        isLoading: false,
        search: '',
        page: 1,
        itemsPerPage: 10,
        rows: [],
        objs: [],
        YearSelected: new Date().getFullYear(),
         // Thêm các trạng thái mới
        showNavigateModal: false,
        navigateType: '',
        selectedNgayBD: '',
        selectedDonViBauCu: null,
        selectCapUngCu: null,
        remainingCapacity: 0,
      };
    },
    computed: {
      // Lọc items dựa trên search
      filteredItems() {
        let items = this.rows;
        if (this.search) {
          const searchLower = this.search.toLowerCase();
          items = items.filter(item => 
            item.tenKyBauCu.toLowerCase().includes(searchLower) ||
            item.moTa.toLowerCase().includes(searchLower) ||
            item.tenCapUngCu.toLowerCase().includes(searchLower) ||
            item.tenDonViBauCu.toLowerCase().includes(searchLower)
          );
        }
        
        // Tính toán phân trang
        const start = (this.page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return items.slice(start, end);
      },
      // Tổng số trang
      numberOfPages() {
        return Math.ceil(this.rows.length / this.itemsPerPage);
      },
    },
    async created() {
      await this.fetchDatas();
    },
    methods: {

        //Định dạng ngày
      formatDate(date) {
        return format(parseISO(date), 'dd/MM/yyyy HH:mm:ss');
      },

      //Chọn năm
      async onYearSelected(year) {
        this.YearSelected = year;
        this.page = 1; // Reset về trang 1
        await this.fetchDatas();
      },

      //Lấy dữ liệu từ API
      async fetchDatas() {
        this.isLoading = true;
        try {
          const res = await api.get(import.meta.env.VITE_GetDetailsListOfElectionBassedOnYear_API + this.YearSelected);
          if (res.status === 200) {
            this.rows = res.data.data;
          } else if (res.status === 401) {
            this.$router.push('/login');
          }
        } catch (error) {
          console.error('Error fetching Datas:', error);
        } finally {
          this.isLoading = false;
        }
      },

      //Xuất ra file excel
      exportToExcel() {
        // Export tất cả dữ liệu, không chỉ trang hiện tại
        const dataToExport = this.rows.map(item => ({
          'Tên kỳ bầu cử': item.tenKyBauCu,
          'Mô tả': item.moTa,
          'Tên cấp ứng cử': item.tenCapUngCu,
          'ID Đơn vị bầu cử': item.iD_DonViBauCu,
          'ID Cấp ứng cử': item.iD_Cap,
          'Tên đơn vị bầu cử': item.tenDonViBauCu,
          'Ngày bắt đầu': this.formatDate(item.ngayBD),
          'Ngày kết thúc': this.formatDate(item.ngayKT),
          'Số lượng cử tri tối đa': item.soLuongToiDaCuTri,
          'Số lượng ứng cử viên tối đa': item.soLuongToiDaUngCuVien,
          'Số lượng bình chọn tối đa': item.soLuotBinhChonToiDa,
          'Công bố': item.congBo,
        }));
  
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachBauCu');
        XLSX.writeFile(workbook, `DanhSachBauCu_${this.YearSelected}.xlsx`);
      },

      //Xem danh sách phiếu bầu đã mã hóa
      viewEncryptedVotes(ngayBD) {
          ngayBD = ngayBD.replace('T', ' ');
          console.log('Di chuyển đến danh sách phiếu bầy mã hóa theo ngayBD: ', ngayBD);

          // Thay đổi mucHienThi để hiển thị component
          this.$parent.ChonMucHienThi(67);

          // Chuyển đến route với tên 'EncryptedVotesByStartDate' và truyền tham số ngayBD
          this.$router.push({
              name: 'encryptedVotesBasedOnElectionDate',
              query: { ngayBD: ngayBD }
          });
      },

        //Xem danh sách phiếu bầu mã hóa theo thời điểm
      viewDecodedVotes(ngayBD){
          ngayBD = ngayBD.replace('T', ' ');
          console.log('Di chuyển đến danh sách phiếu bầu mã hóa theo ngayBD: ', ngayBD);
          
          // Thay đổi mucHienThi để hiển thị component
          this.$parent.ChonMucHienThi(68);

          // Chuyển đến route với tên 'EncryptedVotesByStartDate' và truyền tham số ngayBD
          this.$router.push({
              name: 'getListOfDecodedVotesBasedOnElectionDate',
              query: { ngayBD: ngayBD }
          });
      },

      //Công bố kết quả
      async AnnounceElectionResult(ngayBD, CongBo){
          try{
            if(CongBo === '0'){
              await Swal.fire({
                  icon: 'warning',
                  title: 'Thông báo',
                  text: 'Kết quả bầu cử chưa được công bố!',
                  confirmButtonText: 'Đóng'
              });
              return;
            }
            // Nếu đã công bố, chuyển đến trang kết quả
            ngayBD = ngayBD.replace('T', ' ');
            console.log('Xem kết quả bầu cử theo ngayBD:', ngayBD);
            
            // Emit event to parent (home.vue)
            this.$parent.showElectionResults({
              ngayBD: ngayBD
            });
          }catch (error) {
              console.error('Error viewing election results:', error);
              console.error('Error response:', error.response);
              console.error('Error Message:', error.Message);
              Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xem kết quả bầu cử',
                  confirmButtonText: 'Đóng'
              });
          }
      },

      //Danh sách người dùng chưa bỏ phiếu
      async GetListOfUsersHaveNotVote(ngayBD, CongBo){
          try{
            if(CongBo === '0'){
              await Swal.fire({
                  icon: 'warning',
                  title: 'Thông báo',
                  text: 'Kết quả bầu cử chưa được công bố!',
                  confirmButtonText: 'Đóng'
              });
              return;
            }
            // Nếu đã công bố, chuyển đến trang kết quả
            ngayBD = ngayBD.replace('T', ' ');
            console.log('Xem kết quả bầu cử theo ngayBD:', ngayBD);
            
            // Emit event to parent (home.vue)
            this.$parent.showUserHaveNotVoted({
              ngayBD: ngayBD
            });
          }catch (error) {
              console.error('Error viewing election results:', error);
              console.error('Error response:', error.response);
              console.error('Error Message:', error.Message);
              Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xem kết quả bầu cử',
                  confirmButtonText: 'Đóng'
              });
          }
      },

      //Lấy danh sách các đối tượng chưa tham dự bầy cử
      async showNavigateForm(ngayBD, iD_DonViBauCu, iD_Cap, type) {
          // Tìm thông tin kỳ bầu cử hiện tại
          const currentElection = this.rows.find(item => 
              item.iD_DonViBauCu === iD_DonViBauCu && 
              item.ngayBD.includes(ngayBD)
          );

          if (!currentElection) {
              Swal.mixin({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không tìm thấy thông tin kỳ bầu cử',
                  confirmButtonText: 'Đóng',
                  customClass: {
                      container: 'my-swal'
                  }
              });
              return;
          }

          let currentCount = 0;
          let maxCount = 0;
          let userType = '';

          // Kiểm tra loại người dùng và số lượng tương ứng
          switch(type) {
              case 'voter':
                  currentCount = currentElection.soLuongCuTriHienTai;
                  maxCount = currentElection.soLuongToiDaCuTri;
                  userType = 'cử tri';
                  break;

              case 'candidate':
                  currentCount = currentElection.soLuongUngCuVienHienTai;
                  maxCount = currentElection.soLuongToiDaUngCuVien;
                  userType = 'ứng cử viên';
                  break;

              case 'cadre':
                  currentCount = currentElection.soLuongCanBoHienTai;
                  maxCount = currentElection.soLuongToiDaCanBo || Infinity;
                  userType = 'cán bộ';
                  break;
          }

          // Kiểm tra số lượng
          if (currentCount >= maxCount) {
              Swal.fire({
                  icon: 'warning',
                  title: 'Không thể thêm',
                  text: `Số lượng ${userType} đã đạt tối đa (${maxCount})`,
                  confirmButtonText: 'Đóng',
              });
              return;
          }

          // Nếu còn có thể thêm, tiến hành mở form
          ngayBD = ngayBD.replace('T', ' ');
          this.navigateType = type;
          this.selectedNgayBD = ngayBD;
          this.selectedDonViBauCu = iD_DonViBauCu;
          this.selectCapUngCu = iD_Cap;
          this.showNavigateModal = true;

          // Lưu số lượng còn lại có thể thêm
          this.remainingCapacity = maxCount - currentCount;
      },

      //Xử lý khi thêm thành công
      handleNavigateSuccess() {
          this.fetchDatas();
          this.showNavigateModal = false;  // Force close modal
          this.resetNavigateState();  // Reset state
      },

      //Reset trạng thái
      resetNavigateState() {
          this.navigateType = '';
          this.selectedNgayBD = '';
          this.selectedDonViBauCu = null;
          this.selectCapUngCu = null;
      }

    },
  };
  </script>
  
<style scoped>
    @import url('../../../assets/ThuVien/GetDetailsListOfElectionBassedOnYear.css');
    .action-container {
    width: 100%;
    background: #f8f9fa;
    border-radius: 8px;
}

.actions-scroll-container {
    position: relative;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #90A4AE #CFD8DC;
}

.actions-scroll-container::-webkit-scrollbar {
    height: 6px;
}

.actions-scroll-container::-webkit-scrollbar-track {
    background: #CFD8DC;
    border-radius: 3px;
}

.actions-scroll-container::-webkit-scrollbar-thumb {
    background: #90A4AE;
    border-radius: 3px;
}

.actions-wrapper {
    display: flex;
    align-items: center;
    min-width: min-content;
    padding: 8px 0;
}

.button-group {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    align-items: center;
}

.action-btn {
    white-space: nowrap;
    min-width: fit-content;
    text-transform: none !important;
}

/* Responsive Styles */
@media (max-width: 960px) {
    .actions-wrapper {
        padding: 8px;
    }
    
    .button-group {
        flex-shrink: 0;
    }
    
    .v-divider {
        flex-shrink: 0;
    }
}

@media (min-width: 961px) {
    .actions-scroll-container {
        overflow-x: auto;
    }
    
    .actions-wrapper {
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
}

/* Smooth Scrolling */
.actions-scroll-container {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}
</style>