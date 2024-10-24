<template>
    <div class="mh-50">

        <!--Phần nội dung tiêu đề chính-->
        <div class="container-fluid">
            <div class="row bg-primary bg-gradient p-4 rounded-3 shadow mb-4">
                <div class="col-12 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                        <div>
                            <h1 class="text-white mb-0 fw-bold">Các kỳ bầu cử</h1>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-stretch" name="hehe"> 
                        <!-- Hiển thị ngày tháng năm -->
                        <div class="badge bg-light text-primary text-center fs-6 rounded-pill px-3 w-100 mb-2">
                            {{currentDate}}
                        </div>

                        <!-- Hiển thị phần in thông tin -->
                        <div class="mt-1 w-100 mb-2">
                            <button type="button" class="btn btn-warning w-100" data-mdb-ripple-init>
                                <svg-icon type="mdi" :path="path"></svg-icon>
                                Xuất file PDF
                            </button>
                        </div>

                        <!-- Hiển thị phần thêm -->
                        <div class="w-100">
                            <button class="btn btn-outline-light w-100"  @click="openModal">Thêm kỳ bầu cử</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!--Phần nội dung bảng-->
        <vgt-table
        :columns="columns"
        :rows="rows"
        :search-options="{
            enabled: true
        }"
        :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 10 // Số dòng hiển thị trên mỗi trang
        }"
        :line-numbers="true"
        max-height="70vh" 
        />
    </div>
</template>
  
<script>
import { VueGoodTable as VgtTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import api from '@/services/api.service';
import shared from '@/services/shared.service';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPrinter } from '@mdi/js';
import FormElection from '@/components/forms/election/formElection.vue';
import { Modal } from 'bootstrap';

export default {
    name: 'elections',
    components: {
        VgtTable,
        getCurrentDate(){
            return shared.currentDate();
        },
        SvgIcon,
        FormElection,
        selectedElection: null,
        modalInstance: null,
        modalMode: 'view', // 'view', 'add', 'edit'
    },
    data() {
        return {
            columns: [
                {
                    label: 'Thời điểm bắt đầu',
                    field: 'ngayBD',
                    type: 'date',
                    dateInputFormat: 'dd/MM/yyyy HH:mm:ss',
                    dateOutputFormat: 'dd/MM/yyyy HH:mm:ss',
                },
                {
                    label: 'Thời điểm kết thúc',
                    field: 'ngayKT',
                    type: 'date',
                    dateInputFormat: 'dd/MM/yyyy HH:mm:ss',
                    dateOutputFormat: 'dd/MM/yyyy HH:mm:ss',
                },
                {
                    label: 'Thời điểm kết thúc ghi danh',
                    field: 'ngayKT_UngCu',
                    type: 'date',
                    dateInputFormat: 'dd/MM/yyyy HH:mm:ss',
                    dateOutputFormat: 'dd/MM/yyyy HH:mm:ss',
                },
                {
                    label: 'Tên kỳ bầu cử',
                    field: 'tenKyBauCu',
                    type: 'string',
                },
                {
                    label: 'Mô tả',
                    field: 'moTa',
                    type: 'string',
                },
                {
                    label: 'Số lượng tối đa cử tri',
                    field: 'soLuongToiDaCuTri',
                    type: 'number',
                },
                {
                    label: 'Số lượng tối đa ứng cử viên',
                    field: 'soLuongToiDaUngCuVien',
                    type: 'number',
                },
                {
                    label: 'Số lượt bình chọn tối đa',
                    field: 'soLuotBinhChonToiDa',
                    type: 'number',
                },
                {
                    label: 'Mã danh mục ứng cử',
                    field: 'iD_Cap',
                    type: 'number',
                },
                {
                    label:' Chức năng'
                }
            ],
            rows: [],
            currentDate: shared.currentDate(),
            path: mdiPrinter,
        };
    },
    async created() {
        console.log('Component created');
        await this.TakeAllTheElections();
    },
    methods: {
        //Lấy dữ liệu
        async TakeAllTheElections() {
            try {
                console.log('Fetching data...');
                const res = await api.get('/api/Elections');
                if (res.status === 200) {
                    this.rows = res.data.data;
                    console.log('Data loaded:', this.rows);
                } else if (res.status === 401) {
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
};
</script>