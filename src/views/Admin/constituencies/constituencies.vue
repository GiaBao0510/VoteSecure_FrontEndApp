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

                            <!-- Hiển thị phần thêm -->
                            <div class="col-sm">
                                <button class="btn btn-outline-dark " @click="openAddModal">
                                Thêm kỳ đơn vị bầu cử </button>
                            </div>
                        </div>
                    </div>
                </template>
            </vgt-table>

            <!-- Modal Thêm-->
            <div class="modal fade" id="AddModal" tabindex="-1" aria-labelledby="DataModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="DataModalLabel">Thêm vai trò mới</h5>
                            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <AddForm 
                                @Data-added="handleDataAdded"
                                v-if="showAddForm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Chi tiết-->
            <DetailedForm
                v-if="showDetailModal"
                :entity="selected"
                @update-Data="handleDataUpdated"
                @delete-Data="handleDataDeleted"
                @close="closeDetailModal"
            />

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
    import AddForm from '../../../components/constituencies/AddConstituency.vue';
    import Loading from '../../Loading.vue';
    import { Modal } from 'bootstrap';
    import DetailedForm from '../../../components/constituencies/constituencyDetails.vue';
    import ComponnetTitle from '../ComponnetTitle.vue';
    import * as XLSX from 'xlsx';

    export default {
        name: 'Datas',
        components: {
            VgtTable,
            SvgIcon,
            AddForm,
            Loading,
            DetailedForm,
            ComponnetTitle
        },
        props: {
            ComponnetName: {type: String,default: 'Datas'},
        },
        data() {
            return {
                columns: [
                    {
                        label: 'Mã kỳ đơn vị bầu cử',
                        field: 'iD_DonViBauCu',
                        type: 'number',
                    },
                    {
                        label: 'Tên đơn vị bầu cử',
                        field: 'tenDonViBauCu',
                        type: 'string',
                    },
                    {
                        label: 'Địa chỉ',
                        field: 'diaChi',
                        type: 'string',
                    },
                    {
                        label: 'Mã Quận/Huyện',
                        field: 'iD_QH',
                        type: 'number',
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
        mounted() {
            this.initModal();
        },
        methods: {
            //Khởi tạo modal thêm kỳ bầu cử
            initModal() {
                const modalEl = document.getElementById('AddModal');
                this.modalInstance = new Modal(modalEl);
            },

            //Mở modal thêm kỳ bầu cử
            openAddModal() {
                this.showAddForm = true;
                this.modalInstance.show();
            },

            //Đóng modal thêm kỳ bầu cử
            closeModal() {
                this.modalInstance.hide();
                this.showAddForm = false;
            },

            //Tải dữ liệu từ server
            async fetchDatas() {
                this.isLoading = true;
                try {
                    const res = await api.get(import.meta.env.VITE_CONSTITUENCY_API);
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

            //Xử lý khi thêm kỳ bầu cử thành công
            async handleDataAdded() {
                await this.fetchDatas();
                this.closeModal();
            },

            // Khi một hàng trong bảng được bấm
            onRowClick({ row }) {
                this.selected = row;
                this.openDetailModal();
            },
            openDetailModal() {
                this.showDetailModal = true;
            },
            closeDetailModal() {
                this.showDetailModal = false;
            },

            // Xử lý khi kỳ bầu cử được cập nhật
            async handleDataUpdated() {
                await this.fetchDatas();
                this.closeDetailModal();
            },

            // Xử lý khi kỳ bầu cử được xóa
            async handleDataDeleted() {
                await this.fetchDatas();
                this.closeDetailModal();
            },

            //Xuất file excel
            exportToExcel() {
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(this.rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
                XLSX.writeFile(workbook, 'DonViBauCu.xlsx');
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