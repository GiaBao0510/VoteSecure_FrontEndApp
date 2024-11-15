<template>
    <v-dialog v-model="showModal" max-width="600px" persistent>
        <v-card class="rounded-lg">
            <!-- Header -->
            <v-card-title class="d-flex align-center py-3 px-4 bg-primary">
                <span class="text-h6 font-weight-medium text-white">{{ getTitle }}</span>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    variant="text"
                    @click="closeModal"
                    class="text-white"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
                <!-- Loading Overlay -->
                <v-overlay
                    :model-value="isLoading"
                    class="align-center justify-center"
                    contained
                    scrim="#ffffff"
                >
                    <v-progress-circular
                        color="primary"
                        indeterminate
                        size="64"
                    />
                </v-overlay>

                <!-- Search Field -->
                <div class="px-4 pt-4">
                    <v-text-field
                        v-model="searchQuery"
                        prepend-inner-icon="mdi-magnify"
                        label="Tìm kiếm"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        class="mb-4"
                    ></v-text-field>
                </div>

                <!-- Selection List -->
                <v-list
                    v-if="filteredItems.length > 0"
                    select-strategy="multiple"
                    v-model:selected="selected"
                    class="px-2"
                    show-select
                >
                    <v-list-item
                        v-for="item in filteredItems"
                        :key="item.iD_object"
                        :value="item.iD_object"
                        :title="item.hoTen"
                        class="mb-1 rounded-lg"
                        hover
                    >
                        <template v-slot:prepend="{ isSelected }">
                            <div class="d-flex align-center">
                                <v-checkbox-btn
                                    :model-value="isSelected"
                                    color="primary"
                                    class="me-2"
                                ></v-checkbox-btn>
                                <v-avatar size="40" class="elevation-1">
                                    <v-img
                                        :src="item.hinhAnh || require('@/assets/img/userDefault.png')"
                                        :alt="item.hoTen"
                                        cover
                                    />
                                </v-avatar>
                            </div>
                        </template>

                        <template v-slot:subtitle>
                            <span class="text-caption text-grey-darken-1">
                                ID: {{ item.iD_object }}
                            </span>
                        </template>
                    </v-list-item>
                </v-list>

                <!-- Empty State -->
                <div
                    v-else-if="!isLoading"
                    class="d-flex flex-column align-center justify-center pa-8"
                >
                    <v-icon
                        size="64"
                        color="grey-lighten-1"
                        class="mb-4"
                    >
                        mdi-database-off-outline
                    </v-icon>
                    <span class="text-grey-darken-1">Không có dữ liệu</span>
                </div>
            </v-card-text>

            <!-- Action Buttons -->
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                    variant="text"
                    @click="closeModal"
                    class="me-2"
                    :disabled="isSaving"
                >
                    Hủy
                </v-btn>
                <v-btn
                    color="primary"
                    :loading="isSaving"
                    @click="handleSubmit"
                    class="px-6"
                    elevation="2"
                >
                    <v-icon left class="me-2">mdi-check-circle</v-icon>
                    <span v-if="selected.length > 0">
                        Thêm {{ selected.length }} người dùng
                    </span>
                    <span v-else>
                        Chọn người dùng
                    </span>
                </v-btn>
            </v-card-actions>

            <!-- Selection Summary -->
            <v-slide-x-transition>
                <v-sheet
                    v-if="selected.length > 0"
                    class="d-flex align-center justify-space-between pa-4 bg-grey-lighten-4"
                    style="border-top: 1px solid var(--v-border-color)"
                >
                    <div class="d-flex align-center">
                        <v-icon color="primary" class="me-2">
                            mdi-account-multiple-check
                        </v-icon>
                        <span class="text-primary font-weight-medium">
                            Đã chọn {{ selected.length }} người dùng
                        </span>
                    </div>
                    <v-btn
                        variant="text"
                        color="grey-darken-1"
                        @click="selected = []"
                        size="small"
                        class="text-none"
                    >
                        Bỏ chọn tất cả
                    </v-btn>
                </v-sheet>
            </v-slide-x-transition>
        </v-card>
    </v-dialog>
</template>

<script>
import api from '@/services/api.service';
import Swal from 'sweetalert2';

export default {
    name: 'NavigateToElection',
    props: {
        show: Boolean,
        type: String,
        ngayBD: String,
        iD_DonViBauCu: Number,
        iD_Cap: Number
    },
    data() {
        return {
            showModal: false,
            isLoading: false,
            isSaving: false,
            items: [],
            selected: [],
            searchQuery: '',
        };
    },
    computed: {
        getTitle() {
            switch(this.type) {
                case 'voter': return 'Thêm cử tri vào kỳ bầu cử';
                case 'candidate': return 'Thêm ứng cử viên vào kỳ bầu cử';
                case 'cadre': return 'Thêm cán bộ vào kỳ bầu cử';
                default: return 'Thêm người dùng vào kỳ bầu cử';
            }
        },
        filteredItems() {
            if (!this.searchQuery) return this.items;
            const query = this.searchQuery.toLowerCase();
            return this.items.filter(item => 
                item.hoTen.toLowerCase().includes(query) ||
                item.iD_object.toString().includes(query)
            );
        }
    },
    watch: {
        show(newVal) {
            this.showModal = newVal;
            if (newVal) {
                this.loadData();
            }
        },
        showModal(newVal) {
            if (!newVal) {
                this.$emit('update:show', false);
                this.selected = [];
                this.items = [];
                this.searchQuery = '';
            }
        },
        // Add watcher for selected array
        selected: {
            handler(newVal) {
                console.log('Selected items changed:', newVal);
            },
            deep: true
        }
    },
    methods: {
        async loadData() {
            this.isLoading = true;
            try {
                let apiEndpoint;
                switch(this.type) {
                    case 'voter':
                        apiEndpoint = import.meta.env.VITE_ListOfVotersWhoHaveNotYetParticipatedElection_API;
                        break;
                    case 'candidate':
                        apiEndpoint = import.meta.env.VITE_ListOfCandidatesWhoHaveNotYetParticipatedElection_API;
                        break;
                    case 'cadre':
                        apiEndpoint = import.meta.env.VITE_ListOfCadresWhoHaveNotYetParticipatedElection_API;
                        break;
                }

                const response = await api.get(`${apiEndpoint}${this.ngayBD}`);
                if (response.status === 200) {
                    this.items = response.data.data;
                }
            } catch (error) {
                console.error('Error loading data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể tải danh sách người dùng',
                    confirmButtonText: 'Đóng'
                });
            } finally {
                this.isLoading = false;
            }
        },

        async handleSubmit() {
            console.log('Nút gửi đã được nhấn');
            console.log('Số lượt bình chọn đã chọn:', this.selected.length);
            if (this.selected.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Chưa chọn người dùng',
                    text: 'Vui lòng chọn ít nhất một người dùng để thêm vào kỳ bầu cử',
                    confirmButtonText: 'Đóng'
                });
                return;
            }

            try {
                this.isSaving = true;
                await this.submitSelection();
            } catch (error) {
                console.error('Submit error:', error);
            } finally {
                this.isSaving = false;
            }
        },

        async submitSelection() {
            try {
                let apiEndpoint, PayLoad;
                switch(this.type) {
                    case 'voter':
                        apiEndpoint = import.meta.env.VITE_NAVIGATING_VOTERS_IN_THE_ELECTION_API;
                        PayLoad = {
                            ngayBD: this.ngayBD,
                            ID_DonViBauCu: this.iD_DonViBauCu,
                            listIDVoter: this.selected
                        };
                        break;
                    case 'candidate':
                        apiEndpoint = import.meta.env.VITE_NAVIGATING_CANDIDATES_IN_THE_ELECTION_API;
                        PayLoad = {
                            ngayBD: this.ngayBD,
                            ID_Cap: this.iD_Cap,
                            listIDCandidate: this.selected
                        };
                        break;
                    case 'cadre':
                        apiEndpoint = import.meta.env.VITE_NAVIGATING_CADRES_IN_THE_ELECTION_API;
                        PayLoad = {
                            ngayBD: this.ngayBD,
                            ListID_canbo: this.selected
                        };
                        break;
                }

                console.log('Submitting payload:', PayLoad);

                const response = await api.post(apiEndpoint, PayLoad);
                console.log('Status code:', response.status);
                
                if (response.status === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Đã thêm người dùng vào kỳ bầu cử',
                        confirmButtonText: 'Đóng'
                    });
                    
                    this.$emit('refresh');  // Emit refresh first
                    this.showModal = false; // Close modal
                    this.$emit('update:show', false); // Update parent
                    this.resetForm(); // Reset form data
                }
            } catch (error) {
                console.error('Submit error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response?.data?.message || 'Đã xảy ra lỗi khi thêm người dùng',
                    confirmButtonText: 'Đóng'
                });
            }
        },

        // Add new method to reset form
        resetForm() {
            this.selected = [];
            this.items = [];
            this.searchQuery = '';
            this.isSaving = false;
        },

        closeModal() {
            this.showModal = false;
        }
    }
};
</script>

<style scoped>
.v-btn {
    text-transform: none !important;
}

.v-btn.primary {
    background-color: #1867C0 !important;
    color: white !important;
}

.v-btn.primary:hover {
    background-color: #1756A9 !important;
    transform: translateY(-1px);
}

.v-btn.primary:active {
    transform: translateY(0);
}

.v-list-item {
    transition: all 0.2s ease-in-out;
}

.v-list-item:hover {
    transform: translateX(4px);
    background-color: #f5f5f5;
}

.v-overlay__scrim {
    background: rgba(255, 255, 255, 0.9) !important;
}

.selection-summary {
    position: sticky;
    bottom: 0;
    z-index: 1;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
}
</style>