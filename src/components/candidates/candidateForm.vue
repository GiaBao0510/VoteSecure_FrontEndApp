<script>
    import * as yup from "yup";
    import {Form ,Field ,ErrorMessage} from 'vee-validate';
    import Flatpickr from 'vue-flatpickr-component';
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiPlus } from '@mdi/js';
    import { mdiDeleteCircle } from '@mdi/js';
    import { format, parse, isValid } from 'date-fns';

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
                iD_ucv: yup.string(),
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
                diaChiLienLac: yup.string().required('Địa chỉ không được để trống'),
                hinhAnh: yup.string(),
                publicID: yup.string(),
                iD_DanToc: yup.number().required('Mã dân tộc không được để trống'),
                roleID: yup.number(),
                gioiThieu: yup.string().required('Phần giới thiệu không được để trống'),
                trangThai: yup.string(),
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
                //Chỉ xuất hiện khi thêm    
                iD_ChucVu: yup.number().when([], {
                    is: () => this.isAddMode,
                    then: () => yup.number().required('Mã chức vụ không được để trống'),
                    otherwise: () => yup.number().nullable()
                }),
                iD_Cap: yup.number().when([], {
                    is: () => this.isAddMode,
                    then: () => yup.number().required('Mã cấp bậc không được để trống'),
                    otherwise: () => yup.number().nullable()
                }),
                matKhau: yup.string().when([], {
                    is: () => this.isAddMode,
                    then: () => yup.string().required('Mật khẩu không được để trống'),
                    otherwise: () => yup.string().nullable()
                }),
                ngayBD: yup.string().when([], {
                    is: () => this.isAddMode,
                    then: () => yup.string().required('Ngày bắt đầu không được để trống'),
                    otherwise: () => yup.string().nullable()
                })
            });
            return {
                entityLocal:{ ...this.entity},
                entitySchema,
                pathPlus: mdiPlus,
                pathDelete: mdiDeleteCircle,
                previewImage: null,
            }
        },
        mounted(){
            // Format date when component is mounted
            if (this.entityLocal.ngaySinh) {
            this.entityLocal.ngaySinh = this.formatDateForInput(this.entityLocal.ngaySinh);
            }
        },
        computed:{
            isAddMode() {
                return !this.entityLocal.iD_ucv;
            },
            //Kiểm tra điều kiện trước khi hiển thị nút xóa
            showDeleteButton(){
                return !this.isAddMode;
            },
            //Kiểm tra điều kiện trước khi hiển thị nút sửa
            uniqueId() {
                return `candidate-form-${Date.now()}`;
            }
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

            formatDateForInput(date) {
                if (!date) return '';
                try {
                    if (typeof date === 'string' && date.includes('/')) {
                        const parsedDate = parse(date, 'dd/MM/yyyy HH:mm:ss', new Date());
                        if (isValid(parsedDate)) {
                            return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
                        }
                    }
                    return date;
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            },
 
            //Thêm 
            submit(){
                // Create a clean copy of the data
                console.log("ngay sinh gui di: ",this.entityLocal.ngaySinh);

                const submitData = {
                    ...this.entityLocal,
                    // Use the stored API format for ngayBD
                    ngayBD: this.entityLocal.ngayBD || '',
                    hoTen: this.entityLocal.hoTen?.trim(),
                    gioiTinh: this.entityLocal.gioiTinh,
                    ngaySinh: this.entityLocal.ngaySinh,
                    sdt: this.entityLocal.sdt?.trim(),
                    email: this.entityLocal.email?.trim(),
                    diaChiLienLac: this.entityLocal.diaChiLienLac?.trim(),
                    iD_ChucVu: this.entityLocal.iD_ChucVu,
                    iD_DanToc: this.entityLocal.iD_DanToc,
                    iD_Cap: this.entityLocal.iD_Cap,
                    gioiThieu: this.entityLocal.gioiThieu?.trim(),
                    trangThai: this.entityLocal.trangThai,
                    taiKhoan: this.entityLocal.sdt?.trim(),
                    matKhau: this.entityLocal.matKhau,
                    fileAnh: this.entityLocal.fileAnh,
                };

                this.$emit('submit:entity', submitData);
            },

            //Xóa 
            deleteEntity(){
                this.$emit('delete:entity', this.entityLocal.iD_ucv);
            },

            //Sửa
            editEntity(){
                this.$emit('edit:entity', this.entityLocal.iD_ucv);
            },

            //Sửa lý hiển thị thông tin ngày sinh
            formatDateForDisplay(dateString) {
                if (!dateString) return '';
                // Handle both formats: DD-MM-YYYY and YYYY-MM-DD
                if (dateString.includes('-')) {
                    const parts = dateString.split('-');
                    if (parts[0].length === 4) {
                    // Already in YYYY-MM-DD format
                    return dateString;
                    }
                    // Convert from DD-MM-YYYY to YYYY-MM-DD
                    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
                return dateString;
            },

            handleDateChange(event) {
                const value = event.target.value;
                if (!value) {
                    this.entityLocal.ngaySinh = null;
                    return;
                }
                this.entityLocal.ngaySinh = value;
            },

            formatDateForInput(dateString) {
                if (!dateString) return '';
                try {
                    // If the date is in dd/MM/yyyy HH:mm:ss format
                    if (dateString.includes('/')) {
                        const parsedDate = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
                        if (isValid(parsedDate)) {
                            return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
                        }
                    }
                    // If the date is already in ISO format
                    const date = new Date(dateString);
                    if (isValid(date)) {
                        return format(date, "yyyy-MM-dd'T'HH:mm:ss");
                    }
                    return '';
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return '';
                }
            },

            //Xử lý thay đổi ngày giờ
            handleDateTimeChange(event, handleChange, fieldName) {
                const value = event.target.value;
                
                if (!value) {
                    this.entityLocal[fieldName] = null;
                    handleChange(null);
                    return;
                }

                try {
                    const date = new Date(value);
                    if (isValid(date)) {
                        // Format directly to API format (yyyy-MM-dd HH:mm:ss)
                        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
                        
                        // Store the formatted date
                        this.entityLocal[fieldName] = formattedDate;
                        
                        // Update the form
                        handleChange(formattedDate);
                        
                        console.log('Formatted date:', formattedDate); // For debugging
                    }
                } catch (error) {
                    console.error('Error handling date change:', error);
                }
            }


        },
        // Clean up preview URL when component is destroyed
        beforeUnmount() {
            if (this.previewImage) {
                URL.revokeObjectURL(this.previewImage);
            }
        },
    }
</script>

<template>
    <div class="container py-5">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">
                    {{ isAddMode ? 'Thêm ứng cử viên mới' : 'Thông tin ứng cử viên' }}
                </h4>
            </div>
            <div class="card-body">
                <Form @submit="submit" :validation-schema="entitySchema" v-slot="{errors}" method="post">
                    <div class="row g-4">
                        <!-- ID fields in a row if they exist -->
                        <div class="col-md-6" v-if="entityLocal.iD_ucv != null">
                            <label for="iD_ucv" class="form-label">ID Cử tri</label>
                            <Field name="iD_ucv" type="text" class="form-control-plaintext" v-model="entityLocal.iD_ucv" disabled />
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
                                    :id="`genderMale-${uniqueId}`"
                                    />
                                    <label class="form-check-label" :for="`genderMale-${uniqueId}`">Nam</label>
                                </div>
                                <div class="form-check">
                                    <Field 
                                    name="gioiTinh" 
                                    type="radio" 
                                    class="form-check-input" 
                                    v-model="entityLocal.gioiTinh" 
                                    value="0"
                                    :id="`genderFemale-${uniqueId}`"
                                    />
                                    <label class="form-check-label" :for="`genderFemale-${uniqueId}`">Nữ</label>
                                </div>
                            </div>
                            <ErrorMessage name="gioiTinh" class="text-danger small"/>
                        </div>

                        <div class="col-md-6">
                            <label for="ngaySinh" class="form-label fw-bold">Ngày sinh</label>
                            <Field 
                                name="ngaySinh" 
                                type="date" 
                                class="form-control" 
                                :value="formatDateForInput(entityLocal.ngaySinh)"
                                @input="handleDateChange"
                            />
                            <ErrorMessage name="ngaySinh" class="text-danger small"/>
                        </div>

                        <div class="col-md-6"  v-if="entityLocal.iD_ucv">
                            <label for="trangThai" class="form-label fw-bold">Trạng thái</label>
                            <Field name="trangThai" type="text" class="form-control" v-model="entityLocal.trangThai" />
                            <ErrorMessage name="trangThai" class="text-danger small"/>
                        </div>

                        <div class="col-md-6">
                            <label for="gioiThieu" class="form-label fw-bold">Giới thiệu</label>
                            <Field name="gioiThieu" type="text" class="form-control" v-model="entityLocal.gioiThieu" />
                            <ErrorMessage name="gioiThieu" class="text-danger small"/>
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
                            <label for="iD_DanToc" class="form-label fw-bold">Mã Dân tộc</label>
                            <Field name="iD_DanToc" type="text" class="form-control" v-model="entityLocal.iD_DanToc" />
                            <ErrorMessage name="iD_DanToc" class="text-danger small"/>
                        </div>

                        <template v-if="isAddMode">

                            <div class="col-md-6">
                                <label for="iD_ChucVu" class="form-label fw-bold">Mã chức vụ hiện tại</label>
                                <Field name="iD_ChucVu" type="text" class="form-control" v-model="entityLocal.iD_ChucVu" />
                                <ErrorMessage name="iD_ChucVu" class="text-danger small"/>
                            </div>

                            <div class="col-md-6">
                                <label for="iD_Cap" class="form-label fw-bold">Mã cấp bậc ứng tuyển</label>
                                <Field name="iD_Cap" type="text" class="form-control" v-model="entityLocal.iD_Cap" />
                                <ErrorMessage name="iD_Cap" class="text-danger small"/>
                            </div>

                            <div class="col-md-6">
                                <label for="matKhau" class="form-label fw-bold">Mật khẩu</label>
                                <Field 
                                    name="matKhau" 
                                    type="password" 
                                    class="form-control" 
                                    v-model="entityLocal.matKhau"
                                />
                                <ErrorMessage name="matKhau" class="text-danger small"/>
                            </div>

                            <div class="col-md-6">
                                <label for="ngayBD" class="form-label fw-bold">
                                    Thời điểm bắt đầu kỳ bầu cử
                                </label>
                                <Field name="ngayBD" v-slot="{  field, handleChange }">
                                    <input 
                                        type="datetime-local" 
                                        class="form-control"
                                        :value="formatDateForInput(entityLocal.ngayBD)"
                                        @input="handleDateTimeChange($event, handleChange, 'ngayBD')"
                                        step="1"
                                        required
                                    />
                                </Field>
                                <ErrorMessage name="ngayBD" class="text-danger small"/>
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
                        </template>
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
 @import url('../../assets/ThuVien/voters/formVoter.css');
 .card-body {
  max-height: calc(90vh - 100px);
  overflow-y: auto;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>