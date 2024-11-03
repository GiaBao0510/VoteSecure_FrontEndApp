<script>
    import * as yup from "yup";
    import {Form ,Field ,ErrorMessage} from 'vee-validate';
    import { format, parseISO, parse, isValid } from 'date-fns';
    import Flatpickr from 'vue-flatpickr-component';
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiPlus } from '@mdi/js';
    import { mdiDeleteCircle } from '@mdi/js';

    export default{
        components:{
            Form, Field, ErrorMessage, Flatpickr, SvgIcon
        },
        props:{
            role:{type:Object, required: true}
        },
        emits:['submit:role','delete:role'],
        data(){
            const roleSchema = yup.object().shape({
                id: yup.number(),
                tenVaiTro: yup.string().required('Tên vai trò không được để trống'),
            });
            return {
                roleLocal:{ ...this.role},
                roleSchema,
                pathPlus: mdiPlus,
                pathDelete: mdiDeleteCircle,
            }
        },
        computed:{
            //Kiểm tra điều kiện trước khi hiển thị nút xóa
            showDeleteButton(){
                return this.roleLocal.id !== undefined || this.roleLocal.id !== null;
            }
        },
        methods:{
            //Thêm vai trò
            submit(){
                this.$emit('submit:role', {...this.roleLocal});
            },

            //Xóa vai trò
            deleteRole(){
                this.$emit('delete:role', this.roleLocal.roleID);
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <Form @submit="submit" :validation-schema="roleSchema" v-slot="{errors}" method="post">
            <div class="mb-3" v-if="roleLocal.roleID != null" >
                <label for="roleID" class="form-label">ID vai trò</label>
                <Field name="roleID" type="text" class="form-control" v-model="roleLocal.roleID" disabled />
                <ErrorMessage name="roleID" class="text-danger small"/>
            </div>
            
            <div class="mb-3">
                <label for="tenVaiTro" class="form-label">Tên vai trò</label>
                <Field name="tenVaiTro" type="text" class="form-control" v-model="roleLocal.tenVaiTro" />
                <ErrorMessage name="tenVaiTro" class="text-danger small"/>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" class="btn btn-primary">
                    <svg-icon type="mdi" :path="pathPlus" class="me-2"></svg-icon>Lưu thay đổi
                </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteRole"
                    v-if="showDeleteButton"
                >
                    <svg-icon type="mdi" :path="pathDelete" class="me-2"></svg-icon>Xóa
                </button>
          </div>
        </Form>
    </div>
</template>