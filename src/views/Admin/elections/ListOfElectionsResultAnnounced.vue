<template>
    <div class="mh-50">
        <div class="container-fluid">

            <!--Phần nội dung tiêu đề chính-->
           <ComponnetTitle :ComponnetName="ComponnetName" />
            
            <!--Phần nội dung bảng-->
            <vgt-table
                :columns="columns"
                :rows="rows"
                :search-options="{enabled: true}"
                :pagination-options="{
                    enabled: true,
                    mode: 'records',
                    perPage: 10
                }"
                :line-numbers="true"
                max-height="70vh" 
                :row-style-class="'cursor-pointer'"
                @row-click="onRowClick"
                
            >
                <template #table-actions>
                    <div class="container">
                        <div class="row">
                            <!-- Hiển thị phần in thông tin -->
                            <div class="col-sm">
                                <button type="button" class="btn btn-warning" data-mdb-ripple-init @click="exportToExcel">
                                    <svg-icon type="mdi" :path="path"></svg-icon> Export Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </vgt-table>

            <!-- Loading Overlay -->
            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { VueGoodTable as VgtTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import api from '@/services/api.service';
import shared from '@/services/shared.service';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPrinter } from '@mdi/js';
import Loading from '../../Loading.vue';
import ComponnetTitle from '../ComponnetTitle.vue';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export default {
    name: 'ListOfElectionsResultAnnounced',
    components: {
        VgtTable,
        SvgIcon,
        Loading,
        ComponnetTitle
    },
    props: {
        ComponnetName: {type: String,default: 'elections'},
        ngayBD: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            columns: [
                {
                    label: 'ID ứng cử viên',
                    field: 'iD_ucv',
                    type: 'string',
                },
                {
                    label: 'Họ tên',
                    field: 'hoTen',
                    type: 'string',
                },
                {
                    label: 'Thời điểm đăng ký',
                    field: 'thoiDiemDangKy',
                    type: 'date',
                    formatFn: (value) => {
                        if (!value) return '';
                        return this.formatDateTime(value);
                    }
                },
                {
                    label: 'Email',
                    field: 'email',
                    type: 'string',
                },
                {
                    label: 'Số lượt bình chọn',
                    field: 'soLuotBinhChon',
                    type: 'number',
                },
                {
                    label: 'Tỷ lệ bình chọn',
                    field: 'tyLeBinhChon',
                    type: 'number',
                    formatFn: (value) => `${value.toFixed(2)}%`
                },
                {
                    label: 'Thời điểm bắt đầu bầu cử',
                    field: 'ngayBD',
                    type: 'date',
                    formatFn: (value) => {
                        if (!value) return '';
                        return this.formatDateTime(value);
                    }
                },
                {
                    label: 'ID cấp ứng cử',
                    field: 'iD_Cap',
                    type: 'string',
                },
                {
                    label: 'Tên cấp ứng cử',
                    field: 'tenCapUngCu',
                    type: 'string',
                },
            ],
            rows: [],
            currentDate: shared.currentDate(),
            path: mdiPrinter,
            isLoading: false,
            selectedElection: null,
        };
    },
    watch: {
        ngayBD: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.fetchElections();
                }
            }
        }
    },
    async created() {
        await this.fetchElections();
    },
    methods: {

        formatDateTime(dateTimeStr) {
            try {
                if (!dateTimeStr) return '';
                // Handle ISO string format
                const date = new Date(dateTimeStr);
                return format(date, 'dd/MM/yyyy HH:mm:ss');
            } catch (error) {
                console.error('Date formatting error:', error);
                return dateTimeStr;
            }
        },

        //Tải dữ liệu từ server
        async fetchElections() {
            console.log('>>> Lấy dữ liệu tại ngày Bắt đầu: ', this.ngayBD);

            this.isLoading = true;
            try {
                console.log('Api: ', import.meta.env.VITE_ListOfElectionsResultAnnounced_API + this.ngayBD);
                const res = await api.get(import.meta.env.VITE_ListOfElectionsResultAnnounced_API + this.ngayBD);
                if (res.status === 200) {
                    this.rows = res.data.data;
                    console.log('Fetched data:', this.rows);
                } else if (res.status === 401) {
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching elections:', error);
                console.error('Error.response:', error.response);
                console.error('Error.message:', error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể tải danh sách kết quả bầu cử',
                    confirmButtonText: 'Đóng'
                });
            } finally {
                this.isLoading = false;
            }
        },

        //Xuất file excel
        exportToExcel() {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
            XLSX.writeFile(workbook, 'KetQuaKyBauCu.xlsx');
        }
    }
};
</script>

<style>
.cursor-pointer {
    cursor: pointer;
}
.cursor-pointer:hover {
    background-color: #e0e0e0;
}
</style>