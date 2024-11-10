<template>
    <div class="mh-50">
    <div class="container-fluid">

        <!--Phần nội dung tiêu đề chính-->
       <ComponnetTitle :ComponnetName="ComponnetName" />

       <!-- Thêm component YearSelector -->
      <YearSelector :selectedYear="YearSelected" @yearSelected="onYearSelected" />
        
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
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPrinter } from '@mdi/js';
import Loading from '../../Loading.vue';
import ComponnetTitle from '../ComponnetTitle.vue';
import { format, parseISO } from 'date-fns';
import YearSelector from '@/components/common/yearSelector.vue';
import * as XLSX from 'xlsx';

export default {
    name: 'Datas',
    components: {
        VgtTable,
        SvgIcon,
        Loading,
        ComponnetTitle,
        YearSelector
    },
    props: {
        ComponnetName: {type: String,default: 'Datas'},
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
            YearSelected: new Date().getFullYear(), // Năm được chọn
        };
    },
    async created() {
        await this.fetchDatas();
    },
    methods: {
        //Chọn năm
        onYearSelected(year) {
            this.YearSelected = year;
            this.fetchDatas();
        },
        //Tải dữ liệu từ server
        async fetchDatas() {
            this.isLoading = true;
            try {
                console.log(import.meta.env.VITE_GetDetailedInformationAboutEncryptedVotesBasedOnElectionYear_API + this.YearSelected);
                const res = await api.get(import.meta.env.VITE_GetDetailedInformationAboutEncryptedVotesBasedOnElectionYear_API + this.YearSelected);
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

        //Xuất file excel
        exportToExcel() {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
            XLSX.writeFile(workbook, 'DSphieuBauMaHoa.xlsx');
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