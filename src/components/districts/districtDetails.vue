<script>
    import EntityForm from './districtForm.vue';
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
            async Update(data){
                try{
                    
                    const response = await api.put(`${import.meta.env.VITE_DISTRICT_API}/${data.iD_QH}`,{
                        tenQH: data.tenQH,
                        stt: data.stt,
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
                    if(error.response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật Thất bại',
                            text:  'Đầu vào không hợp lệ',
                            confirmButtonText: 'Đóng'
                        });
                    }
                    console.log("error message", error.message);
                    console.log("error status", error.response.status);
                }
            },

            //Xóa
            async Delete(iD_QH){
                try{
                    console.log("Xóa: ",iD_QH);
                    console.log("Api: ",`${import.meta.env.VITE_DISTRICT_API}/${iD_QH}`);
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                       
                        const response = await api.delete(`${import.meta.env.VITE_DISTRICT_API}/${iD_QH}`);
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
                        <h5 class="modal-title">Chi tiết Quận/Huyện</h5>
                        <button type="button" class="btn-close" @click="$emit('close')"></button>
                    </div>
                    <div class="modal-body">
                        <EntityForm
                            :entity="entityLocal"
                            @submit:entity="Update"
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