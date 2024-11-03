<script>
    import roleForm from './roleForm.vue';
    import Swal from "sweetalert2";
    import api from '../../services/api.service';

    export default{
        name:'roleDetails',
        components:{
            roleForm
        },
        props:{
            role:{
                type:Object,
                required:true
            }
        },
        data(){
            return {
                roleLocal:{
                    ...this.role
                }
            };
        },
        methods:{
            //Cập nhật
            async Update(data){
                try{
                    console.log(">>Sửa: ",data.roleID);
                    console.log("Api: ",`${import.meta.env.VITE_ROLE_API}/${data.roleID}`);
                    const response = await api.put(`${import.meta.env.VITE_ROLE_API}/${data.roleID}`,{
                        RoleID: data.roleID,
                        TenVaiTro: data.tenVaiTro,
                    });
                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Cập nhật kỳ bầu cử thành công',
                            confirmButtonText: 'Đóng'
                        });
                        this.$emit('update-election');
                    }else if(response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Thất bại',
                            text: response.data.message || 'Cập nhật thất bại'
                        });
                    }
                    else{
                        throw new Error(response.data.message || 'Cập nhật thất bại');
                    }
                }catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: error.message || 'Đã xảy ra lỗi khi cập nhật kỳ bầu cử'
                    });
                }
            },

            //Xóa
            async Delete(roleID){
                try{
                    console.log("Xóa: ",roleID);
                    console.log("Api: ",`${import.meta.env.VITE_ROLE_API}/${roleID}`);
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                       
                        const response = await api.delete(`${import.meta.env.VITE_ROLE_API}/${roleID}`);
                        if (response.status === 200 && response.data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                text: response.data.message,
                                confirmButtonText: 'Đóng'
                            });
                            this.$emit('delete-election');

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
                        <roleForm
                            :role="roleLocal"
                            @submit:role="Update"
                            @delete:role="Delete"
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