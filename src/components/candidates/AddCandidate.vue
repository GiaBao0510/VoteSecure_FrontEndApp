<script>
    import EntityForm from './candidateForm.vue';
    import api from '../../services/api.service';
    import Swal from "sweetalert2";
    import Loading from '../../views/Loading.vue';

    export default{
        name: 'AddConstituency',
        components:{
            EntityForm, Loading
        },
        data(){
            return{
                isLoading: false,
                entity: {
                    fileAnh:'',
                    hoTen:'',
                    gioiTinh:'',
                    ngaySinh:'',
                    sdt:'',
                    email:'',
                    diaChiLienLac:'',
                    iD_ChucVu:'',
                    iD_DanToc:'',
                    taiKhoan:'',
                    iD_Cap:'',
                    matKhau:'',
                    gioiThieu:'',
                    ngayBD:'',
                },
            }
        },
        methods:{
            //Thêm
            async AddEntity(entityData) {
                this.isLoading = true;
                try {
                    // Create FormData
                    const formData = new FormData();
                    
                    // Add file if exists
                    if (entityData.fileAnh) {
                        formData.append('fileAnh', entityData.fileAnh);
                    }
                    
                    // Add other fields with correct casing
                    formData.append('HoTen', entityData.hoTen || '');
                    formData.append('GioiTinh', entityData.gioiTinh || '');
                    formData.append('NgaySinh', entityData.ngaySinh || '');
                    formData.append('SDT', entityData.sdt || '');
                    formData.append('Email', entityData.email || '');
                    formData.append('DiaChiLienLac', entityData.diaChiLienLac || '');
                    formData.append('ID_ChucVu', entityData.iD_ChucVu || '');
                    formData.append('TaiKhoan', entityData.taiKhoan || '');
                    formData.append('MatKhau', entityData.matKhau || '');
                    formData.append('GioiThieu', entityData.gioiThieu || '');
                    formData.append('ID_Cap', entityData.iD_Cap || '');
                    formData.append('NgayBD', entityData.ngayBD || '');
                    formData.append('ID_DanToc', entityData.iD_DanToc || '');

                    // Debug log
                    console.log('Submitting data:', Object.fromEntries(formData));

                    const response = await api.post(
                        import.meta.env.VITE_CANDIDATE_API,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    if (response?.data) {
                        if (response.data.status === 'OK') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thêm thành công',
                                text: response.data.message,
                                confirmButtonText: 'Đóng'
                            });
                            this.$emit('Data-added');
                        } else {
                            throw new Error(response.data.message);
                        }
                    }
                } catch (error) {
                    console.error('Add voter error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Thêm thất bại',
                        text: error.response?.data?.message || error.message || 'Đã có lỗi xảy ra',
                        confirmButtonText: 'Đóng'
                    });
                } finally {
                    this.isLoading = false;
                }
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <EntityForm 
            :entity="entity"
            @submit:entity="AddEntity"
        />
        <Loading v-if="isLoading" />
    </div>
</template>