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
            Form, Field, ErrorMessage, Flatpickr ,SvgIcon
        },
        props:{
            election:{type:Object, required:true}
        },
        emits:['submit:election','delete:election'],
        data(){
            const electionSchema = yup.object().shape({
              ngayBD: yup
                .string()
                .required("Vui lòng chọn thời điểm bắt đầu")
                .test('valid-date', 'Ngày không hợp lệ', value => {
                    if (!value) return false;
                    return isValid(parse(value, 'dd/MM/yyyy HH:mm:ss', new Date()));
                })
                .test('before-end', 'Thời điểm bắt đầu phải nhỏ hơn thời điểm kết thúc', function(value) {
                    const endDate = this.parent.ngayKT;
                    if (!value || !endDate) return true;
                    
                    const start = parse(value, 'dd/MM/yyyy HH:mm:ss', new Date());
                    const end = parse(endDate, 'dd/MM/yyyy HH:mm:ss', new Date());
                    
                    return isValid(start) && isValid(end) && start < end;
                }),
              ngayKT: yup 
                .string()
                .required("Vui lòng chọn thời điểm kết thúc")
                .test('valid-date', 'Ngày không hợp lệ', value => {
                    if (!value) return false;
                    return isValid(parse(value, 'dd/MM/yyyy HH:mm:ss', new Date()));
                }),
              tenKyBauCu: yup.string().required('Vui lòng điền tên kỳ bầu cử'),
              moTa: yup.string().required('Vui lòng điền mô tả'),
              soLuongToiDaCuTri: yup.number().required('Vui lòng điền số lượng cử tri tối đa'),
              soLuongToiDaUngCuVien: yup.number().required('Vui lòng điền số lượng ứng cử viên tối đa'),
              soLuotBinhChonToiDa: yup.number().required('Vui lòng điền số lượt bình chọn tối đa')
                .test('is-less-than', 'Số lượt bình chọn tối đa phải nhỏ hơn số lượng ứng cử viên tối đa 1 đơn vị', function (value) {
                    return value < this.parent.soLuongToiDaUngCuVien;
                }),
              iD_Cap: yup.string().required('Vui lòng chọn mã danh mục ứng cử')
            });
            return {
                electionLocal:  { ...this.election },
                electionSchema,
                pathPlus: mdiPlus,
                pathDelete: mdiDeleteCircle,
            };
        },
        computed:{
          showDeleteButton(){
            return this.electionLocal.ngayBD!== null && this.electionLocal.ngayBD !== '';
          }
        },
        methods:{
          // Format date để hiển thị trong input datetime-local
          formatDateForInput(date) {
              if (!date) return '';
              try {
                  if (typeof date === 'string' && date.includes('/')) {
                      const parsedDate = parse(date, 'dd/MM/yyyy HH:mm:ss', new Date());
                      if (isValid(parsedDate)) {
                          return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
                      }
                  }
                  return date;
              } catch (error) {
                  console.error('Error formatting date:', error);
                  return '';
              }
          },
          handleDateTimeChange(event, handleChange, fieldName) {
            const value = event.target.value;
            
            if (!value) {
                this.electionLocal[fieldName] = null;
                handleChange(null);
                return;
            }

            try {
                const date = new Date(value);
                if (isValid(date)) {
                    const formattedDateForDisplay = format(date, 'dd/MM/yyyy HH:mm:ss');
                    this.electionLocal[fieldName] = formattedDateForDisplay;
                    handleChange(formattedDateForDisplay);
                }
            } catch (error) {
                console.error('Error handling date change:', error);
            }
        },

        // Add this new method to format dates for API submission
        formatDatesForSubmission() {
            const formattedElection = { ...this.electionLocal };
            if (formattedElection.ngayBD) {
                const startDate = parse(formattedElection.ngayBD, 'dd/MM/yyyy HH:mm:ss', new Date());
                formattedElection.ngayBD = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
            }
            if (formattedElection.ngayKT) {
                const endDate = parse(formattedElection.ngayKT, 'dd/MM/yyyy HH:mm:ss', new Date());
                formattedElection.ngayKT = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
            }
            return formattedElection;
        },

        submitelection() {
            const formattedElection = this.formatDatesForSubmission();
            this.$emit("submit:election", formattedElection);
        },
        
        //Thêm kỳ bầu cử
        submitelection() {
          this.$emit("submit:election", this.electionLocal);
        },

        //Xóa kỳ bầu cử theo ngày bắt đầu
        deleteelection(){
          this.$emit('delete:election', this.electionLocal.ngayBD);
        }
      }
    }
</script>

<template>
  <div class="container py-5">
    <div class="card shadow-lg">
      <div class="card-header bg-primary text-white">
        <h3 class="mb-0">Thông tin kỳ bầu cử</h3>
      </div>
      <div class="card-body">
        <Form @submit="submitelection" :validation-schema="electionSchema" v-slot="{ errors }" method="post">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="ngayBD" class="form-label">Ngày bắt đầu</label>
              <Field name="ngayBD" v-slot="{ handleChange }">
                <input type="datetime-local" class="form-control" 
                  :value="formatDateForInput(electionLocal.ngayBD)"
                  @input="handleDateTimeChange($event, handleChange, 'ngayBD')"
                  step="1"  required/>
              </Field>
              <ErrorMessage name="ngayBD" class="text-danger small"/>
            </div>
            <div class="col-md-6 mb-3">
              <label for="ngayKT" class="form-label">Ngày kết thúc</label>
              <Field name="ngayKT" v-slot="{ handleChange }">
                <input type="datetime-local" class="form-control"
                  :value="formatDateForInput(electionLocal.ngayKT)"
                  @input="handleDateTimeChange($event, handleChange, 'ngayKT')"
                  step="1" required />
              </Field>
              <ErrorMessage name="ngayKT" class="text-danger small"/>
            </div>
          </div>

          <div class="mb-3">
            <label for="tenKyBauCu" class="form-label">Tên kỳ bầu cử</label>
            <Field name="tenKyBauCu" type="text" class="form-control" v-model="electionLocal.tenKyBauCu" />
            <ErrorMessage name="tenKyBauCu" class="text-danger small"/>
          </div>

          <div class="mb-3">
            <label for="moTa" class="form-label">Mô tả</label>
            <Field name="moTa" as="textarea" class="form-control" v-model="electionLocal.moTa" rows="3" />
            <ErrorMessage name="moTa" class="text-danger small"/>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="soLuongToiDaCuTri" class="form-label">Số lượng cử tri tối đa</label>
              <Field name="soLuongToiDaCuTri" type="number" class="form-control" v-model="electionLocal.soLuongToiDaCuTri" />
              <ErrorMessage name="soLuongToiDaCuTri" class="text-danger small"/>
            </div>
            <div class="col-md-4 mb-3">
              <label for="soLuongToiDaUngCuVien" class="form-label">Số lượng ứng cử viên tối đa</label>
              <Field name="soLuongToiDaUngCuVien" type="number" class="form-control" v-model="electionLocal.soLuongToiDaUngCuVien" />
              <ErrorMessage name="soLuongToiDaUngCuVien" class="text-danger small"/>
            </div>
            <div class="col-md-4 mb-3">
              <label for="soLuotBinhChonToiDa" class="form-label">Số lượt bình chọn tối đa</label>
              <Field name="soLuotBinhChonToiDa" type="number" class="form-control" v-model="electionLocal.soLuotBinhChonToiDa" />
              <ErrorMessage name="soLuotBinhChonToiDa" class="text-danger small"/>
            </div>
          </div>

          <div class="mb-3">
            <label for="iD_Cap" class="form-label">Mã danh mục ứng cử</label>
            <Field name="iD_Cap" type="text" class="form-control" v-model="electionLocal.iD_Cap" />
            <ErrorMessage name="iD_Cap" class="text-danger small"/>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-primary">
              <svg-icon type="mdi" :path="pathPlus" class="me-2"></svg-icon>Lưu thay đổi
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteelection"
              v-if="showDeleteButton"
            >
              <svg-icon type="mdi" :path="pathDelete" class="me-2"></svg-icon>Xóa
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
        border-radius: 15px;
    }
    .card-header {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }
    .form-control:focus {
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
</style>