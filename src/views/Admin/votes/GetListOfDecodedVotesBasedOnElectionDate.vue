<template>
    <div class="mh-50">
    <div class="container-fluid">

        <!--Phần nội dung tiêu đề chính-->
       <ComponnetTitle :ComponnetName="ComponnetName" />
        
        <!-- Thêm phần cuốn lịch -->
        <div class="d-flex justify-content-end mb-3">
            <Flatpickr
                v-model="presentTime"
                :config="{
                    dateFormat: 'Y-m-d H:i:s',
                    enableTime: true,
                    time_24hr: true,
                    enableSeconds: true,
                    CSSAnimation:true,
                    
                }"
                @on-change="onDateTimeChanged"
                class="border border-5 border-dark"
            />
        </div>

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
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPrinter } from '@mdi/js';
import Swal from "sweetalert2";
import Loading from '../../Loading.vue';
import ComponnetTitle from '../ComponnetTitle.vue';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

export default {
    name: 'Datas',
    components: {
        VgtTable, 
        SvgIcon,
        Loading, 
        ComponnetTitle,
        Flatpickr,
    },
    props: {
        ComponnetName: {type: String,default: 'Datas'},
        ngayBatDauDuocNhan: {type: String, default: ''},
    },
    data() {
        return {
            columns: [
                {
                    label: 'Mã phiếu bầu',
                    field: 'iD_Phieu',
                    type: 'string',
                },
                {
                    label: 'Giá trị phiếu',
                    field: 'giaTriPhieuBau',
                    type: 'number',
                },
                {
                    label: 'Thời điểm',
                    field: 'thoiDiem',
                    type: 'string',
                    formatFn: (value) => {
                        return format(parseISO(value), 'dd/MM/yyyy HH:mm:ss');
                    },
                },
                {
                    label: 'Mã người dùng',
                    field: 'iD_user',
                    type: 'string',
                },
                {
                    label: 'Họ tên',
                    field: 'hoTen',
                    type: 'string',
                },
            ],
            rows: [],
            currentDate: shared.currentDate(),
            path: mdiPrinter,
            modalInstance: null,
            showAddForm: false,
            isLoading: false,
            selected: null,
            showDetailModal: false,
            presentTime: this.$route.query.ngayBD || shared.currentDateTime() // Ngày giờ hiện tại
        };
    },
    async created() {
        await this.fetchDatas();

    },
    methods: {
        //Chọn ngày giờ
        onDateTimeChanged(selectedDates, dateStr, instance) {
            this.presentTime = dateStr;
            this.fetchDatas();
        },
        //Tải dữ liệu từ server
        async fetchDatas() {
            this.isLoading = true;
            var res = null;
            try {
                console.log('path: ',import.meta.env.VITE_GetListOfDecodedVotesBasedOnElectionDate_API + this.presentTime);
                res = await api.get(import.meta.env.VITE_GetListOfDecodedVotesBasedOnElectionDate_API + this.presentTime);
                
                if (res && res.status === 200) {
                    this.rows = res.data.data;
                } else if (res && res.status === 401) {
                    this.$router.push('/login');
                } else if (res && res.status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi khi lấy dữ liệu',
                        text: res.data.message,
                        confirmButtonText: 'Đóng'
                    });
                } else {
                    console.error('Unexpected error:', res);
                }
            } catch (error) {
                console.error('Error fetching Datas:', error);
                console.error('Error status:', error.status);
                console.error('Error message:', error.message);
            } finally {
                this.isLoading = false;
            }
        },

        //Xuất file excel
        exportToExcel() {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
            XLSX.writeFile(workbook, 'DSphieuBauGiaiMa.xlsx');
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