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
        >
            <template #table-actions>
                <div class="container">
                    <div class="row">
                        <!-- Hiển thị phần in thông tin -->
                        <div class="col-sm">
                            <button type="button" class="btn btn-warning" data-mdb-ripple-init>
                                <svg-icon type="mdi" :path="path"></svg-icon> Export PDF
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

export default {
    name: 'Datas',
    components: {
        VgtTable,
        SvgIcon,
        Loading,
        ComponnetTitle
    },
    props: {
        ComponnetName: {type: String,default: 'Datas'},
    },
    data() {
        return {
            columns: [
                {
                    label: 'Thời điểm',
                    field: 'thoiDiem',
                    type: 'string',
                    formatFn: (value) => {
                        return format(parseISO(value), 'dd/MM/yyyy HH:mm:ss');
                    },
                },
                {
                    label: 'Địa chỉ IP',
                    field: 'diaChiIP',
                    type: 'string',
                },
                {
                    label: 'Tài khoản',
                    field: 'taiKhoan',
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
        };
    },
    async created() {
        await this.fetchDatas();
    },
    methods: {
        //Tải dữ liệu từ server
        async fetchDatas() {
            this.isLoading = true;
            try {
                const res = await api.get(import.meta.env.VITE_VOTER_LOGIN_HISTORY_LIST_API);
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