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
        emits:['submit:entity','delete:entity','edit:entity'],
        data(){
            const entitySchema = yup.object().shape({
                iD_CuTri: yup.string(),
                iD_user: yup.string(),
                hoTen: yup.string().required('Họ tên không được để trống'),
                gioiTinh: yup.string().required('Giới tính không được để trống'),
                ngaySinh: yup.date()
                    .max(new Date(), 'Ngày sinh không thể lớn hơn ngày hiện tại')
                    .required('Ngày sinh không được để trống'),
                sdt: yup.string()
                    .required('Số điện thoại không được để trống')
                    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
                email: yup.string()
                    .required('Email không được để trống')
                    .email('Email không hợp lệ'),
                taiKhoan: yup.string(),
                diaChiLienLac: yup.string().required('Địa chỉ không được để trống'),
                hinhAnh: yup.string(),
                publicID: yup.string(),
                iD_ChucVu: yup.number(),
                iD_DanToc: yup.number(),
                roleID: yup.number(),
                fileAnh: yup
                    .mixed()
                    .test('fileSize', 'File size is too large', (value) => {
                        if (!value) return true; // Skip if no file
                        return value.size <= 5000000; // 5MB limit
                    })
                    .test('fileType', 'Unsupported file type', (value) => {
                        if (!value) return true; // Skip if no file
                        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
                    }),
            });
            return {
                entityLocal:{ ...this.entity},
                entitySchema,
                pathPlus: mdiPlus,
                pathDelete: mdiDeleteCircle,
                previewImage: null,
            }
        },
        computed:{
            //Kiểm tra điều kiện trước khi hiển thị nút xóa
            showDeleteButton(){
                let check = this.entityLocal.iD_CuTri !== undefined ;
                console.log('>>> Ma cu tri: ',this.entityLocal.iD_CuTri);
                console.log('>>> Check: ',check);
                return check;
            },
            
        },
        methods:{
            handleFileUpload(event) {
                const file = event.target.files[0];
                if (file) {
                    this.entityLocal.fileAnh = file;
                    // Create preview URL
                    this.previewImage = URL.createObjectURL(file);
                }
            },

            clearFileInput() {
                this.entityLocal.fileAnh = null;
                this.previewImage = null;
            },

            //Thêm 
            submit(){
                // Create a clean copy of the data
                const submitData = {
                    fileAnh: this.entityLocal.fileAnh,
                    hoTen: this.entityLocal.hoTen?.trim(),
                    gioiTinh: this.entityLocal.gioiTinh,
                    ngaySinh: this.entityLocal.ngaySinh,
                    sdt: this.entityLocal.sdt?.trim(),
                    email: this.entityLocal.email?.trim(),
                    diaChiLienLac: this.entityLocal.diaChiLienLac?.trim(),
                    iD_ChucVu: this.entityLocal.iD_ChucVu,
                    iD_DanToc: this.entityLocal.iD_DanToc
                };

                this.$emit('submit:entity', submitData);
            },

            //Xóa 
            deleteEntity(){
                this.$emit('delete:entity', this.entityLocal.iD_CuTri);
            },

            //Sửa
            editEntity(){
                this.$emit('edit:entity', this.entityLocal.iD_CuTri);
            }
        },
        // Clean up preview URL when component is destroyed
        beforeUnmount() {
            if (this.previewImage) {
                URL.revokeObjectURL(this.previewImage);
            }
        }
    }
</script>

<template>
    <div class="container py-5">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Thông tin cử tri</h4>
            </div>
            <div class="card-body">
                <Form @submit="submit" :validation-schema="entitySchema" v-slot="{errors}" method="post">
                    <div class="row g-4">
                        <!-- ID fields in a row if they exist -->
                        <div class="col-md-6" v-if="entityLocal.iD_CuTri != null">
                            <label for="iD_CuTri" class="form-label">ID Cử tri</label>
                            <Field name="iD_CuTri" type="text" class="form-control-plaintext" v-model="entityLocal.iD_CuTri" disabled />
                        </div>
                        <div class="col-md-6" v-if="entityLocal.iD_user != null">
                            <label for="iD_user" class="form-label">ID người dùng</label>
                            <Field name="iD_user" type="text" class="form-control-plaintext" v-model="entityLocal.iD_user" disabled />
                        </div>

                        <!-- Personal Information -->
                        <div class="col-md-6">
                            <label for="hoTen" class="form-label fw-bold">Họ tên</label>
                            <Field name="hoTen" type="text" class="form-control" v-model="entityLocal.hoTen" placeholder="Nhập họ tên"/>
                            <ErrorMessage name="hoTen" class="text-danger small"/>
                        </div>

                        <!-- Gender Selection -->
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Giới tính</label>
                            <div class="d-flex gap-4">
                                <div class="form-check">
                                    <Field 
                                        name="gioiTinh" 
                                        type="radio" 
                                        class="form-check-input" 
                                        v-model="entityLocal.gioiTinh" 
                                        value="1"
                                        id="genderMale"
                                    />
                                    <label class="form-check-label" for="genderMale">Nam</label>
                                </div>
                                <div class="form-check">
                                    <Field 
                                        name="gioiTinh" 
                                        type="radio" 
                                        class="form-check-input" 
                                        v-model="entityLocal.gioiTinh" 
                                        value="0"
                                        id="genderFemale"
                                    />
                                    <label class="form-check-label" for="genderFemale">Nữ</label>
                                </div>
                            </div>
                            <ErrorMessage name="gioiTinh" class="text-danger small"/>
                        </div>

                        <div class="col-md-6">
                            <label for="ngaySinh" class="form-label fw-bold">Ngày sinh</label>
                            <Field name="ngaySinh" type="date" class="form-control" v-model="entityLocal.ngaySinh" />
                            <ErrorMessage name="ngaySinh" class="text-danger small"/>
                        </div>

                        <!-- Contact Information -->
                        <div class="col-md-6">
                            <label for="sdt" class="form-label fw-bold">Số điện thoại</label>
                            <Field name="sdt" type="tel" class="form-control" v-model="entityLocal.sdt" placeholder="0123456789"/>
                            <ErrorMessage name="sdt" class="text-danger small"/>
                        </div>

                        <div class="col-md-6">
                            <label for="email" class="form-label fw-bold">Email</label>
                            <Field name="email" type="email" class="form-control" v-model="entityLocal.email" placeholder="example@email.com"/>
                            <ErrorMessage name="email" class="text-danger small"/>
                        </div>

                        <div class="col-12">
                            <label for="diaChiLienLac" class="form-label fw-bold">Địa chỉ</label>
                            <Field name="diaChiLienLac" type="text" class="form-control" v-model="entityLocal.diaChiLienLac" placeholder="Nhập địa chỉ liên lạc"/>
                            <ErrorMessage name="diaChiLienLac" class="text-danger small"/>
                        </div>

                        <!-- Additional Information -->
                        <div class="col-md-6">
                            <label for="iD_DanToc" class="form-label fw-bold">Dân tộc</label>
                            <Field name="iD_DanToc" type="text" class="form-control" v-model="entityLocal.iD_DanToc" />
                            <ErrorMessage name="iD_DanToc" class="text-danger small"/>
                        </div>

                        <div class="col-md-6">
                            <label for="iD_ChucVu" class="form-label fw-bold">Chức vụ</label>
                            <Field name="iD_ChucVu" type="text" class="form-control" v-model="entityLocal.iD_ChucVu" />
                            <ErrorMessage name="iD_ChucVu" class="text-danger small"/>
                        </div>

                        <!-- Image Upload -->
                        <div class="col-12">
                            <label for="fileAnh" class="form-label fw-bold">Hình ảnh</label>
                            <div class="input-group">
                                <input
                                    type="file"
                                    class="form-control"
                                    id="fileAnh"
                                    accept="image/*"
                                    @change="handleFileUpload"
                                    :class="{ 'is-invalid': errors.fileAnh }"
                                />
                                <button 
                                    v-if="entityLocal.fileAnh"
                                    type="button" 
                                    class="btn btn-outline-secondary"
                                    @click="clearFileInput"
                                >
                                    <i class="bi bi-x-lg"></i> Xóa
                                </button>
                            </div>
                            <ErrorMessage name="fileAnh" class="text-danger small"/>
                            
                            <!-- Image Preview -->
                            <div v-if="previewImage" class="mt-2">
                                <img 
                                    :src="previewImage" 
                                    alt="Preview" 
                                    class="img-thumbnail"
                                    style="max-height: 200px"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex gap-2 justify-content-end mt-4">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i>Lưu thay đổi
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            @click="deleteEntity"
                            v-if="showDeleteButton"
                        >
                            <i class="bi bi-trash me-2"></i>Xóa
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border: none;
    border-radius: 10px;
}

.card-header {
    border-radius: 10px 10px 0 0;
}

.form-control, .form-select {
    border-radius: 8px;
    border: 1px solid #dee2e6;
    padding: 0.75rem 1rem;
}

.form-control:focus, .form-select:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
}

.img-thumbnail {
    border-radius: 8px;
    max-width: 100%;
    height: auto;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}
</style>