<script>
    import EntityForm from './boardForm.vue';
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
                    tenBan:'',
                    iD_DonViBauCu:-1,
                },
            }
        },
        methods:{
            //Thêm
            async AddEntity(entity){
                this.isLoading = true;
                try{
                    console.log('api add: ',import.meta.env.VITE_BOARD_API);
                    console.log('input: ',entity);
                    const response = await api.post(import.meta.env.VITE_BOARD_API,{
                        tenBan: entity.tenBan,
                        iD_DonViBauCu: entity.iD_DonViBauCu,
                    });

                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm thành công',
                            text: response.data.message,
                            confirmButtonText: 'Đóng'
                        });
                        this.$emit('role-added');
                    } else if(response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Thêm thất bại',
                            text: response.data.message,
                            confirmButtonText: 'Đóng'
                        });
                    }
                }catch (error) {
                    console.error('Login error:', error);
                    const errorMessage = error.response?.data?.message 
                        || error.response?.statusText 
                        || error.message 
                        || 'Đã có lỗi xảy ra';
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: errorMessage,
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
        <EntityForm @submit:entity="AddEntity" :entity="entity" />
        <Loading v-if="isLoading" />
    </div>
</template>