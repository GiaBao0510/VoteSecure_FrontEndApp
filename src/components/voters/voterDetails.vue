<script>
    import EntityForm from './voterForm.vue';
    import Swal from "sweetalert2";
    import api from '../../services/api.service';

    export default{
        name:'constituencyDetails',
        components:{
            EntityForm
        },
        props:{
            entity:{
                type:Object,
                required:true
            }
        },
        data(){
            return {
                entityLocal:{
                    ...this.entity
                }
            };
        },
        methods:{
            //Cập nhật
            async Update(data, old_PhoneNum){
                try{
                    const response = await api.put(`${import.meta.env.VITE_VOTER_API}/${data.iD_CuTri}`,{
                        HoTen: data.tenDonViBauCu,
                        GioiTinh: data.gioiTinh,
                        NgaySinh: data.ngaySinh,
                        DiaChiLienLac: data.diaChiLienLac,
                        TaiKhoan: old_PhoneNum,
                        SDT: data.sdt,
                        Email: data.email,
                        ID_DanToc: data.iD_DanToc,
                        RoleID: 5
                    });
                    console.log(">>> status: " + response.status);
                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Cập nhật cử thành công',
                            confirmButtonText: 'Đóng'
                        });
                        this.$emit('update-constituency');
                    }else if(response.status == 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật Thất bại',
                            text: response.data.message,
                            confirmButtonText: 'Đóng'
                        });
                    }
                    else{
                        throw new Error(response.data.message || 'Cập nhật thất bại');
                    }
                }catch (error) {
                    // Improve error handling
                    const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi';
                    if(error.response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật Thất bại',
                            text:  'Đầu vào không hợp lệ',
                            confirmButtonText: 'Đóng'
                        });
                    }
                    console.log("error message", error.message);
                    console.log("error message", errorMessage);
                    console.log("error status", error.response.status);
                }
            },

            //Xóa
            async Delete(iD_CuTri){
                try{
                    console.log("Xóa: ",iD_CuTri);
                    console.log("Api: ",`${import.meta.env.VITE_VOTER_API}/${iD_CuTri}`);
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                       
                        const response = await api.delete(`${import.meta.env.VITE_VOTER_API}/${iD_CuTri}`);
                        if (response.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                text: response.data.message,
                                confirmButtonText: 'Đóng'
                            });
                            this.$emit('delete-constituency');

                            //Load lại trang
                            this.$router.go();

                        } else {
                            throw new Error(response.data.message || 'Xóa thất bại');
                        }
                    }
                }catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: error.message || 'Đã xảy ra lỗi khi xóa 500'
                    });
                }
            }
        }
    } 
</script>

<template>
    <div>
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết vai trò</h5>
                        <button type="button" class="btn-close" @click="$emit('close')"></button>
                    </div>
                    <div class="modal-body">
                        <EntityForm
                            :entity="entityLocal"
                            @edit:entity="Update"
                            @delete:entity="Delete"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}
</style>