<script>
    import * as yup from "yup";
    import {Form ,Field ,ErrorMessage} from 'vee-validate';
    import Flatpickr from 'vue-flatpickr-component';
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiPlus } from '@mdi/js';
    import { mdiDeleteCircle } from '@mdi/js';

    export default{
        components:{
            Form, Field, ErrorMessage, Flatpickr, SvgIcon
        },
        props:{
            entity:{type:Object, required: true}
        },
        emits:['submit:entity','delete:entity'],
        data(){
            const entitySchema = yup.object().shape({
                iD_ChucVu: yup.number().required('Mã chức vụ không được để trống'),
                iD_Ban: yup.string().required('Mã ban không được để trống'),
                iD_canbo: yup.string().required('Mã cán bộ không được để trống'),
                tenBan: yup.string(),
                tenChucVu: yup.string(),
                hoTen: yup.string(),
            });
            return {
                entityLocal:{ ...this.entity},
                entitySchema,
                pathPlus: mdiPlus,
                pathDelete: mdiDeleteCircle,
            }
        },
        computed:{
            //Kiểm tra điều kiện trước khi hiển thị nút xóa
            showDeleteButton(){
                return this.entityLocal.iD_canbo !== undefined || 
                    this.entityLocal.iD_canbo !== null;
            }
        },
        methods:{
            //Thêm 
            submit(){
                this.$emit('submit:entity', {...this.entityLocal});
            },

            //Xóa 
            deleteEntity(){
                this.$emit('delete:entity', this.entityLocal.iD_canbo);
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <Form @submit="submit" :validation-schema="entitySchema" v-slot="{errors}" method="post">
            <div class="mb-3" v-if="entityLocal.iD_ChucVu != null" >
                <label for="iD_ChucVu" class="form-label">ID chức vụ</label>
                <Field name="iD_ChucVu" type="text" class="form-control" v-model="entityLocal.iD_ChucVu" disabled />
                <ErrorMessage name="iD_ChucVu" class="text-danger small"/>
            </div>
            <div class="mb-3">
                <label for="iD_Ban" class="form-label">ID ban</label>
                <Field name="iD_Ban" type="text" class="form-control" v-model="entityLocal.iD_Ban" />
                <ErrorMessage name="iD_Ban" class="text-danger small"/>
            </div>
            <div class="mb-3">
                <label for="iD_canbo" class="form-label">ID Cán bộ</label>
                <Field name="iD_canbo" type="text" class="form-control" v-model="entityLocal.iD_canbo" />
                <ErrorMessage name="iD_canbo" class="text-danger small"/>
            </div>
            <div class="mb-3" >
                <label for="tenBan" class="form-label">Ban</label>
                <Field name="tenBan" type="text" class="form-control" v-model="entityLocal.tenBan" />
                <ErrorMessage name="tenBan" class="text-danger small"/>
            </div>
            <div class="mb-3" >
                <label for="tenChucVu" class="form-label"> Chức vụ</label>
                <Field name="tenChucVu" type="text" class="form-control" v-model="entityLocal.tenChucVu" />
                <ErrorMessage name="tenChucVu" class="text-danger small"/>
            </div>
            <div class="mb-3" >
                <label for="hoTen" class="form-label">Tên cán bộ</label>
                <Field name="hoTen" type="text" class="form-control" v-model="entityLocal.hoTen" />
                <ErrorMessage name="hoTen" class="text-danger small"/>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" class="btn btn-primary">
                    <svg-icon type="mdi" :path="pathPlus" class="me-2"></svg-icon>Lưu thay đổi
                </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteEntity"
                    v-if="showDeleteButton"
                >
                    <svg-icon type="mdi" :path="pathDelete" class="me-2"></svg-icon>Xóa
                </button>
          </div>
        </Form>
    </div>
</template>