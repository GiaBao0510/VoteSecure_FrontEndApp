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
                iD_CapUngCu: yup.number(),
                tenCapUngCu: yup.string().required('Tên cấp ứng cử không được để trống'),
                iD_DonViBauCu: yup.number().required('ID đơn vị bầu cử không được để trống'),
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
                return this.entityLocal.iD_Cap !== undefined || 
                    this.entityLocal.iD_Cap !== null;
            }
        },
        methods:{
            //Thêm 
            submit(){
                this.$emit('submit:entity', {...this.entityLocal});
            },

            //Xóa 
            deleteEntity(){
                this.$emit('delete:entity', this.entityLocal.iD_Cap);
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <Form @submit="submit" :validation-schema="entitySchema" v-slot="{errors}" method="post">
            <div class="mb-3" v-if="entityLocal.iD_CapUngCu != null" >
                <label for="iD_CapUngCu" class="form-label">ID cấp ứng cử</label>
                <Field name="iD_CapUngCu" type="text" class="form-control" v-model="entityLocal.iD_CapUngCu" disabled />
                <ErrorMessage name="iD_CapUngCu" class="text-danger small"/>
            </div>
            <div class="mb-3">
                <label for="tenCapUngCu" class="form-label">Tên cấp ứng cử</label>
                <Field name="tenCapUngCu" type="text" class="form-control" v-model="entityLocal.tenCapUngCu" />
                <ErrorMessage name="tenCapUngCu" class="text-danger small"/>
            </div>
            <div class="mb-3" >
                <label for="iD_DonViBauCu" class="form-label">ID đơn vị bầu cử</label>
                <Field name="iD_DonViBauCu" type="text" class="form-control" v-model="entityLocal.iD_DonViBauCu" />
                <ErrorMessage name="iD_DonViBauCu" class="text-danger small"/>
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