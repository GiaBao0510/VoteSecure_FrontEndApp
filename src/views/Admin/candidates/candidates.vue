<template>
    <v-container fluid>
      <!-- Tiêu đề -->
      <ComponnetTitle :ComponnetName="ComponnetName" />
  
      <!-- Controls Container -->
      <div class="controls-container pa-4">
        <v-card flat class="mb-4">
            <v-container fluid>
            <v-row dense align="center" no-gutters>
                <!-- Search Field -->
                <v-col cols="12" md="6" sm="12">
                <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Tìm kiếm"
                    single-line
                    hide-details
                    variant="outlined"
                    density="comfortable"
                    class="mr-2"
                    clearable
                ></v-text-field>
                </v-col>

                <!-- Action Buttons Container -->
                <v-col cols="12" md="6" sm="12">
                <v-row dense align="center" no-gutters>
                    <!-- Add Button -->
                    <v-col cols="6" class="px-1">
                      <v-btn
                          color="primary"
                          prepend-icon="mdi-account-plus"
                          @click="openAddModal"
                          :block="true"
                          :height="40"
                      >
                          Thêm ứng cử viên
                      </v-btn>
                    </v-col>

                    <!-- Export Button -->
                    <v-col cols="6" class="px-1">
                    <v-btn
                        color="warning"
                        prepend-icon="mdi-microsoft-excel"
                        @click="exportToExcel"
                        :block="true"
                        :height="40"
                    >
                        Export Excel
                    </v-btn>
                    </v-col>
                </v-row>
                </v-col>
            </v-row>
            </v-container>
        </v-card>
      </div>

        <!--  Modal thêm cử tri-->
        <v-dialog v-model="showAddForm" max-width="800px">
          <v-card>
            <v-card-title class="text-h5 bg-primary text-white pa-4">
              <span>Thêm Cử Tri Mới</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeAddModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <AddForm 
                @Data-added="handleDataAdded"
                v-if="showAddForm"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
  
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
            @click="onRowClick({ row: item })"
          >
            <!-- Avatar của cử tri -->
            <template v-slot:prepend>
                <v-avatar size="60" class="image-container">
                <v-img
                    v-if="item.hinhAnh"
                    :src="item.hinhAnh"
                    :lazy-src="'../../../assets/img/loadingUser.png'"
                    :alt="item.hoTen"
                    cover
                    class="rounded-circle"
                    @error="handleImageError"
                >
                    <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                        <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                        ></v-progress-circular>
                    </v-row>
                    </template>
                </v-img>
                <v-icon v-else size="40" icon="mdi-account"></v-icon>
                </v-avatar>
            </template>
  
            <v-list-item-title class="text-h6 mb-1">
              {{ item.hoTen }}
            </v-list-item-title>
  
            <v-list-item-subtitle>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div><strong>Mã ứng cử viên:</strong> {{ item.iD_ucv }}</div>
                  <div><strong>Giới tính:</strong> {{ item.gioiTinh === '1' ? 'Nam' : 'Nữ' }}</div>
                  <div><strong>Ngày sinh:</strong> {{ item.ngaySinh }}</div>
                  <div><strong>Trạng thái:</strong> {{ item.trangThai }}</div>
                  <div><strong>Địa chỉ:</strong> {{ item.diaChiLienLac }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div><strong>Số điện thoại:</strong> {{ item.sdt }}</div>
                  <div><strong>Email:</strong> {{ item.email }}</div>
                  <div><strong>Giới thiệu:</strong> {{ item.gioiThieu }}</div>
                  <div><strong>Mã chức vụ:</strong> {{ item.iD_ChucVu }}</div>
                  <div><strong>Mã dân tộc:</strong> {{ item.iD_DanToc }}</div>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
  
            <v-list-item-action>
              <v-btn
                color="primary"
                variant="text"
                @click.stop="onRowClick({ row: item })"
                small
              >
                Chi tiết
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
  
      <!-- Modal Chi tiết-->
      <v-dialog v-model="showDetailModal" max-width="800px" scrollable>
        <v-card class="detail-modal">
          <v-card-text class="pa-0">
            <DetailedForm
              v-if="showDetailModal"
              :entity="selected"
              @update-Data="handleDataUpdated"
              @delete-Data="handleDataDeleted"
              @close="closeDetailModal"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
  
      <!-- Modal Thêm -->
      <v-dialog v-model="showAddForm" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Thêm cử tri mới</span>
          </v-card-title>
          <v-card-text>
            <AddForm 
              @Data-added="handleDataAdded"
              v-if="showAddForm"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </template>

<script>
import api from '@/services/api.service';
import AddForm from '../../../components/candidates/AddCandidate.vue';
import Loading from '../../Loading.vue';
import DetailedForm from '../../../components/candidates/candidateDetails.vue';
import ComponnetTitle from '../ComponnetTitle.vue';
import * as XLSX from 'xlsx';

export default {
  name: 'Voters',
  components: {
    AddForm,
    Loading,
    DetailedForm,
    ComponnetTitle
  },
  props: {
    ComponnetName: { type: String, default: 'Datas' },
  },
  data() {
    return {
      isLoading: false,
      search: '',
      page: 1,
      itemsPerPage: 10,
      rows: [],
      selected: null,
      showDetailModal: false,
      showAddForm: false
    };
  },
  computed: {
    //Tìm kiếm
    filteredItems() {
      let items = this.rows;
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        items = items.filter(item => 
          item.hoTen.toLowerCase().includes(searchLower) ||
          item.iD_ucv.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower) ||
          item.sdt.includes(searchLower)
        );
      }
      
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return items.slice(start, end);
    },
    numberOfPages() {
      return Math.ceil(this.rows.length / this.itemsPerPage);
    },
  },
  async created() {
    await this.fetchDatas();
  },
  methods: {

    //Lấy dữ liệu
    async fetchDatas() {
      this.isLoading = true;
      try {
        const res = await api.get(import.meta.env.VITE_GET_ALL_CANDIDATES_API);
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

    onRowClick({ row }) {
      this.selected = { ...row };
      this.showDetailModal = true;
    },

    closeDetailModal() {
      this.showDetailModal = false;
      this.selected = null;
    },

    //Làm mới khi thêm
    async handleDataAdded() {
      await this.fetchDatas();
      this.showAddForm = false;
    },

    //làm mới khi cập nhật
    async handleDataUpdated() {
      await this.fetchDatas();
      this.closeDetailModal();
    },

    //Làm mới khi xóa
    async handleDataDeleted() {
      await this.fetchDatas();
      this.closeDetailModal();
    },

    //Mở form thêm
    openAddModal() {
      this.showAddForm = true;
    },

    //Đóng form thêm
    closeAddModal() {
      this.showAddForm = false;
    },
    
    //Xuất file Excel
    exportToExcel() {
      const dataToExport = this.rows.map(item => ({
        'Mã ứng cử viên': item.iD_ucv,
        'Họ tên': item.hoTen,
        'Giới tính': item.gioiTinh === '1' ? 'Nam' : 'Nữ',
        'Ngày sinh': item.ngaySinh,
        'Địa chỉ': item.diaChiLienLac,
        'Số điện thoại': item.sdt,
        'Email': item.email,
        'Mã chức vụ': item.iD_ChucVu,
        'Mã dân tộc': item.iD_DanToc,
        'Trạng thái': item.trangThai,
        'Giới thiệu': item.gioiThieu, 
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachCuTri');
      XLSX.writeFile(workbook, 'DanhSachCuTri.xlsx');
    },

    //Xử lý khi không tìm thấy ảnh
    handleImageError(event) {
      return require('@/assets/img/userDefault.png');
    },
  }
};
</script>

<style scoped>
  @import url('@/assets/ThuVien/nguoiDung.css');
</style>