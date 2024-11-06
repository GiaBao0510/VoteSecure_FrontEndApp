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
                iD_QH: yup.number(),
                tenQH: yup.string().required('Tên Quận/Huyện không được để trống'),
                stt: yup.string().required('Số thứ tự Tỉnh thành không được bỏ trống'),
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
                return this.entityLocal.iD_QH !== undefined || 
                    this.entityLocal.iD_QH !== null;
            }
        },
        methods:{
            //Thêm 
            submit(){
                this.$emit('submit:entity', {...this.entityLocal});
            },

            //Xóa 
            deleteEntity(){
                this.$emit('delete:entity', this.entityLocal.iD_QH);
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <Form @submit="submit" :validation-schema="entitySchema" v-slot="{errors}" method="post">
            <div class="mb-3" v-if="entityLocal.iD_QH != null" >
                <label for="iD_QH" class="form-label">ID Quận/Huyện</label>
                <Field name="iD_QH" type="text" class="form-control" v-model="entityLocal.iD_QH" disabled />
                <ErrorMessage name="iD_QH" class="text-danger small"/>
            </div>
            <div class="mb-3">
                <label for="tenQH" class="form-label">Tên Quận/Huyện</label>
                <Field name="tenQH" type="text" class="form-control" v-model="entityLocal.tenQH" />
                <ErrorMessage name="tenQH" class="text-danger small"/>
            </div>
            <div class="mb-3">
                <label for="stt" class="form-label">Số thứ tự</label>
                <Field name="stt" type="text" class="form-control" v-model="entityLocal.stt" />
                <ErrorMessage name="stt" class="text-danger small"/>
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