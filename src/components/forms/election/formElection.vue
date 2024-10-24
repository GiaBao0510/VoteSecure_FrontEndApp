<template>
  <div class="card mb-4">
    <div class="card-body">
      <form @submit.prevent="handleSubmit" class="row g-3" method="post">
        <div class="col-md-6">
          <label for="tenKyBauCu" class="form-label">Tên kỳ bầu cử</label>
          <input v-model="formData.tenKyBauCu" type="text" class="form-control" id="tenKyBauCu" required />
        </div>
        <div class="col-md-6">
          <label for="ngayBD" class="form-label">Ngày bắt đầu</label>
          <input v-model="formData.ngayBD" type="date" class="form-control" id="ngayBD" required />
        </div>
        <div class="col-md-6">
          <label for="ngayKT" class="form-label">Ngày kết thúc</label>
          <input v-model="formData.ngayKT" type="date" class="form-control" id="ngayKT" required />
        </div>
        <div class="col-md-6">
          <label for="moTa" class="form-label">Mô tả</label>
          <textarea v-model="formData.moTa" class="form-control" id="moTa"></textarea>
        </div>
        <div class="col-md-6">
          <label for="soLuongToiDaCuTri" class="form-label">Số lượng tối đa cử tri</label>
          <textarea v-model="formData.moTa" class="form-control" id="soLuongToiDaCuTri"></textarea>
        </div>
        <div class="col-md-6">
          <label for="soLuongToiDaUngCuVien" class="form-label">Số lượng tối đa ứng cử viên</label>
          <textarea v-model="formData.soLuongToiDaUngCuVien" class="form-control" id="soLuongToiDaUngCuVien"></textarea>
        </div>
        <div class="col-md-6">
          <label for="soLuotBinhChonToiDa" class="form-label">Số lượt bình chọn tối đa trên một phiếu</label>
          <textarea v-model="formData.soLuotBinhChonToiDa" class="form-control" id="soLuotBinhChonToiDa"></textarea>
        </div>
        <div class="col-md-6">
          <label for="iD_Cap" class="form-label">Mã danh mục ứng cử</label>
          <textarea v-model="formData.iD_Cap" class="form-control" id="iD_Cap"></textarea>
        </div>

        <!--Bấm gửi-->
        <div class="col-12">
          <button type="submit" class="btn btn-primary">Lưu</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import api from '../../../services/api.service'
import moment from 'moment'
import Swal from 'sweetalert2'

export default {
  props: {
    positions: {
      type: Array,
      required: true
    }
  },
  
  emits: ['submit-success'],
  
  setup(props, { emit }) {
    const initialFormState = {
      tenKyBauCu: '',
      ngayBD: '',
      ngayKT: '',
      moTa: '',
      SoLuongToiDaCuTri: '',
      SoLuongToiDaUngCuVien: '',
      SoLuotBinhChonToiDa: '',
      ID_Cap: ''
    }

    const formData = reactive({ ...initialFormState })
    const errors = reactive({})

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.tenKyBauCu) {
        newErrors.tenKyBauCu = 'Vui lòng nhập tên kỳ bầu cử'
      }
      
      if (!formData.ID_Cap) {
        newErrors.ID_Cap = 'Vui lòng chọn chức vụ'
      }
      
      if (!formData.ngayBD) {
        newErrors.ngayBD = 'Vui lòng chọn ngày bắt đầu'
      }
      
      if (!formData.ngayKT) {
        newErrors.ngayKT = 'Vui lòng chọn ngày kết thúc'
      }
      
      if (moment(formData.ngayKT).isBefore(formData.ngayBD)) {
        newErrors.ngayKT = 'Ngày kết thúc phải sau ngày bắt đầu'
      }
      
      if (!formData.SoLuongToiDaCuTri || formData.SoLuongToiDaCuTri < 1) {
        newErrors.SoLuongToiDaCuTri = 'Vui lòng nhập số lượng cử tri hợp lệ'
      }
      
      if (!formData.SoLuongToiDaUngCuVien || formData.SoLuongToiDaUngCuVien < 1) {
        newErrors.SoLuongToiDaUngCuVien = 'Vui lòng nhập số lượng ứng viên hợp lệ'
      }
      
      if (!formData.SoLuotBinhChonToiDa || formData.SoLuotBinhChonToiDa < 1) {
        newErrors.SoLuotBinhChonToiDa = 'Vui lòng nhập số lượt bình chọn hợp lệ'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const resetForm = () => {
      Object.assign(formData, initialFormState)
      Object.keys(errors).forEach(key => delete errors[key])
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      try {
        const payload = {
          ...formData,
          ngayBD: moment(formData.ngayBD).format('YYYY-MM-DDTHH:mm:ss'),
          ngayKT: moment(formData.ngayKT).format('YYYY-MM-DDTHH:mm:ss'),
          SoLuongToiDaCuTri: parseInt(formData.SoLuongToiDaCuTri),
          SoLuongToiDaUngCuVien: parseInt(formData.SoLuongToiDaUngCuVien),
          SoLuotBinhChonToiDa: parseInt(formData.SoLuotBinhChonToiDa)
        }

        await api.post('/api/Elections', payload)

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã thêm kỳ bầu cử mới!'
        })

        emit('submit-success')
        resetForm()
      } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể thêm kỳ bầu cử. Vui lòng thử lại!'
        })
      }
    }

    return {
      formData,
      errors,
      handleSubmit,
      resetForm
    }
  }
}
</script>