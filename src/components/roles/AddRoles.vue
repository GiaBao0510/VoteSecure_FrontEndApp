<script>
    import roleForm from './roleForm.vue';
    import api from '../../services/api.service';
    import Swal from "sweetalert2";
    import Loading from '../../views/Loading.vue';

    export default{
        name: 'AddRole',
        components:{
            roleForm, Loading
        },
        data(){
            return{
                isLoading: false,
                role: {
                    tenVaiTro:''
                },
            }
        },
        methods:{
            //Thêm
            async AddRole(role){
                this.isLoading = true;
                try{
                    const response = await api.post(import.meta.env.VITE_ROLE_API,{
                        tenVaiTro: role.tenVaiTro,
                    });

                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm vai trò thành công',
                            text: response.data.message,
                            confirmButtonText: 'Đóng'
                        });
                        this.$emit('role-added');
                    } else if(response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Thêm vai trò thất bại',
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
        <roleForm @submit:role="AddRole" :role="role" />
        <Loading v-if="isLoading" />
    </div>
</template>