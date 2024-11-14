<script>
    import EntityForm from './candidateForm.vue';
    import Swal from "sweetalert2";
    import api from '../../services/api.service';
 
    export default{
        name:'constituencyDetails', 
        components:{
            EntityForm
        },
        props:{
            entity:{
                type:Object,
                required:true
            }
        },
        data(){
            return {
                entityLocal:{
                    ...this.entity,
                    ngaySinh: this.formatDateForInput(this.entity.ngaySinh)
                }
            };
        },
        methods:{
            //Cập nhật
            async Update(data){
                try{
                    console.log(' --- Đầu vào: ',data);
                   
                   let ngaySinh = data.ngaySinh.split('T')[0];
                   console.log('--- ngay sinh: ',ngaySinh);
                    // Định dạng lại ngày sinh
                    
                    const response = await api.put(`${import.meta.env.VITE_CANDIDATE_API}/${this.entity.iD_ucv}`,{
                        HoTen: data.hoTen,
                        GioiTinh: data.gioiTinh,
                        NgaySinh: ngaySinh,
                        DiaChiLienLac: data.diaChiLienLac,
                        SDT: data.sdt,
                        Email: data.email,
                        ID_DanToc: data.iD_DanToc,
                        TrangThai: data.trangThai,
                        GioiThieu: data.gioiThieu,
                        ID_ChucVu: data.iD_ChucVu,
                        RoleID: 2
                    });
                    console.log(">>> status: " + response.status);
                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Cập nhật cử thành công',
                            confirmButtonText: 'Đóng'
                        });
                        this.$emit('update-data');
                        this.$emit('close');
                    }else if(response.status == 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật Thất bại',
                            text: response.data.message,
                            confirmButtonText: 'Đóng'
                        });
                    }
                    else{
                        throw new Error(response.data.message || 'Cập nhật thất bại');
                    }
                }catch (error) {
                    // Improve error handling
                    const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi';
                    if(error.response.status === 400){
                        Swal.fire({
                            icon: 'error',
                            title: 'Cập nhật Thất bại',
                            text:  'Đầu vào không hợp lệ',
                            confirmButtonText: 'Đóng'
                        });
                    }
                    console.log("error message", error.message);
                    console.log("error message", errorMessage);
                    console.log("error status", error.response.status);
                }
            },

            //Xóa
            async Delete(iD_ucv){
                try{
                    console.log("Xóa: ",iD_ucv);
                    console.log("Api: ",`${import.meta.env.VITE_CANDIDATE_API}/${iD_ucv}`);
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                       
                        const response = await api.delete(`${import.meta.env.VITE_CANDIDATE_API}/${iD_ucv}`);
                        if (response.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                text: response.data.message,
                                confirmButtonText: 'Đóng'
                            });
                            this.$emit('delete-data');

                            //Load lại trang
                            this.$router.go();

                        } else {
                            throw new Error(response.data.message || 'Xóa thất bại');
                        }
                    }
                }catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: error.message || 'Đã xảy ra lỗi khi xóa 500'
                    });
                }
            },

            //Định dạng ngày tháng năm
            formatDateForInput(dateString) {
                if (!dateString) return '';
                try {
                    const [day, month, year] = dateString.split('-');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return dateString;
                }
            },

            //Thay đổi ảnh
            async handleImageChange(event) {
                const file = event.target.files[0];
                if (!file) return;

                try {
                    const formData = new FormData();
                    formData.append('fileAnh', file);

                    // Call separate API endpoint for image update
                    const response = await api.put(
                    `${import.meta.env.VITE_CANDIDATE_API}/update-image/${this.entityLocal.iD_ucv}`,
                    formData,
                    {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    }
                    );

                    if (response.status === 200) {
                    // Update local image
                    this.entityLocal.hinhAnh = response.data.data.hinhAnh;
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật ảnh thành công',
                        confirmButtonText: 'Đóng'
                    });
                    
                    // Emit update event to refresh parent
                    this.$emit('update-Data');
                    }
                } catch (error) {
                    console.error('Error updating image:', error);
                    Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response?.data?.message || 'Không thể cập nhật ảnh',
                    confirmButtonText: 'Đóng'
                    });
                }
            },
        }
    } 
</script>

<template>
    <div>
    <v-card flat>
      <v-card-text>
        <!-- Current Image Display -->
        <div class="text-center mb-4">
          <v-avatar size="150">
            <v-img
              :src="entityLocal.hinhAnh || require('@/assets/img/userDefault.png')"
              :alt="entityLocal.hoTen"
              cover
            >
              <template v-slot:placeholder>
                <v-row align="center" justify="center">
                  <v-progress-circular indeterminate></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-avatar>
          
          <!-- Image Update Button -->
          <div class="mt-2">
            <v-btn
              color="primary"
              size="small"
              @click="$refs.imageInput.click()"
            >
              <v-icon left>mdi-camera</v-icon>
              Thay đổi ảnh
            </v-btn>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="handleImageChange"
            />
          </div>
        </div>

        <EntityForm
          :entity="entityLocal"
          @submit:entity="Update"
          @delete:entity="Delete"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}
.v-avatar {
  border: 2px solid #eee;
}
</style>