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
                  <div><strong>Đơn vị bầu cử:</strong> {{ item.tenDonViBauCu }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div><strong>Thời gian:</strong> {{ formatDate(item.ngayBD) }} - {{ formatDate(item.ngayKT) }}</div>
                  <div><strong>Số lượng cử tri tối đa:</strong> {{ item.soLuongToiDaCuTri }}</div>
                  <div><strong>Số lượng ứng cử viên tối đa:</strong> {{ item.soLuongToiDaUngCuVien }}</div>
                  <div><strong>Số lượt bình chọn tối đa:</strong> {{ item.soLuotBinhChonToiDa }}</div>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
  
            <v-list-item-action class="mt-5">
                <v-chip
                :color="item.congBo === '1' ? 'success' : 'warning'"
                size="small"
                >
                {{ item.congBo == '1' ? 'Đã công bố' : 'Chưa công bố' }}
                </v-chip>
                <v-btn
                    color="primary"
                    @click="viewEncryptedVotes(item.ngayBD)"
                    class="ml-2"
                    small
                >
                    Danh sách <br/>phiếu mã hóa
                </v-btn>
                <v-btn
                    color="primary"
                    variant="outlined"
                    @click="viewDecodedVotes(item.ngayBD)"
                    class="ml-2"
                    small
                >
                    Danh sách <br/>phiếu giải mã
                </v-btn>
                <v-btn
                    color="primary"
                    @click="viewDecodedVotes(item.ngayBD)"
                    class="ml-2"
                    small
                >
                    Danh sách các <br/>ứng cử viên
                </v-btn>
                <v-btn
                    @click="AnnounceElectionResult(item.ngayBD,item.congBo )"
                    class="ml-2"
                    :color="item.congBo === '1' ? 'warning' : 'info'"
                    small
                >
                    Công bố kết quả
                </v-btn>
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
  </template>
  
  <script>
  import { format, parseISO } from 'date-fns';
  import * as XLSX from 'xlsx';
  import api from '@/services/api.service';
  import ComponnetTitle from '../ComponnetTitle.vue';
  import YearSelector from '@/components/common/yearSelector.vue';
  import EncryptedBallotList from '../votes/GetDetailedInformationAboutEncryptedVotesBasedOnElectionYear.vue';
  import Swal from "sweetalert2";

  export default {
    name: 'ElectionList',
    components: {
      ComponnetTitle,
      YearSelector,
      EncryptedBallotList
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
        YearSelected: new Date().getFullYear(),
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
            if(CongBo === '1'){
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Kết quả đã được công bố',
                    confirmButtonText: 'Đóng'
                });
                return;
            }
        },
    },
  };
  </script>
  
<style scoped>
    @import url('../../../assets/ThuVien/GetDetailsListOfElectionBassedOnYear.css');
</style>