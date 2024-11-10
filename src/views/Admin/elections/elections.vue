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
                                Thêm kỳ bầu cử
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </vgt-table>

            <!-- Modal Thêm kỳ bầu cử -->
            <div class="modal fade" id="electionModal" tabindex="-1" aria-labelledby="electionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="electionModalLabel">Thêm kỳ bầu cử mới</h5>
                            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <AddElection 
                                @election-added="handleElectionAdded"
                                v-if="showAddForm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Chi tiết Kỳ Bầu Cử -->
            <ElectionDetail
                v-if="showDetailModal"
                :election="selectedElection"
                @update-election="handleElectionUpdated"
                @delete-election="handleElectionDeleted"
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
import AddElection from '../../../components/elections/AddElection.vue';
import Loading from '../../Loading.vue';
import { Modal } from 'bootstrap';
import ElectionDetail from '../../../components/elections/electionDetails.vue';
import ComponnetTitle from '../ComponnetTitle.vue';
import * as XLSX from 'xlsx';

export default {
    name: 'elections',
    components: {
        VgtTable,
        SvgIcon,
        AddElection,
        Loading,
        ElectionDetail,
        ComponnetTitle
    },
    props: {
        ComponnetName: {type: String,default: 'elections'},
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
                    field: 'soLuongToiDaUngCuVien' ,
                    type: 'number'
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
                    label: 'Công bố',
                    field: 'congBo',
                    type: 'string',
                    formatFn: (value) => {
                        return value === '0' || value === 0 ? 'Chưa công bố kết quả' : 'Đã công bố kết quả';
                    }
                }
            ],
            rows: [],
            currentDate: shared.currentDate(),
            path: mdiPrinter,
            modalInstance: null,
            showAddForm: false,
            isLoading: false,
            selectedElection: null,
            showDetailModal: false,
        };
    },
    async created() {
        await this.fetchElections();
    },
    mounted() {
        this.initModal();
    },
    methods: {
        //Khởi tạo modal thêm kỳ bầu cử
        initModal() {
            const modalEl = document.getElementById('electionModal');
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
        async fetchElections() {
            this.isLoading = true;
            try {
                const res = await api.get(import.meta.env.VITE_ELECTION_API);
                if (res.status === 200) {
                    this.rows = res.data.data;
                    console.log(this.electionLocal);
                } else if (res.status === 401) {
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching elections:', error);
            } finally {
                this.isLoading = false;
            }
        },

        //Xử lý khi thêm kỳ bầu cử thành công
        async handleElectionAdded() {
            await this.fetchElections();
            this.closeModal();
        },

        // Khi một hàng trong bảng được bấm
        onRowClick({ row }) {
            this.selectedElection = row;
            this.openDetailModal();
        },
        openDetailModal() {
            this.showDetailModal = true;
        },
        closeDetailModal() {
            this.showDetailModal = false;
        },

        // Xử lý khi kỳ bầu cử được cập nhật
        async handleElectionUpdated() {
            await this.fetchElections();
            this.closeDetailModal();
        },

        // Xử lý khi kỳ bầu cử được xóa
        async handleElectionDeleted() {
            await this.fetchElections();
            this.closeDetailModal();
        },

        //Xuất file excel
        exportToExcel() {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
            XLSX.writeFile(workbook, 'KyBauCu.xlsx');
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