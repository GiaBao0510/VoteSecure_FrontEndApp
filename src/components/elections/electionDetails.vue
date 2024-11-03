<script>
    import electionForm from './electionForm.vue';
    import api from '../../services/api.service';
    import Swal from 'sweetalert2';

    export default {
        name: 'electionDetail',
        components: { electionForm },
        props: {
            election: { type: Object, required: true },
        },
        data(){
            return{
                electionLocal: {
                    ...this.election,
                    ngayBD: this.formatApiDate(this.election.ngayBD),
                    ngayKT: this.formatApiDate(this.election.ngayKT)
                }
            };
        },
        methods:{

            //định dạng lại ngày
            formatApiDate(date) {
                if (!date) return null;
                // Đảm bảo ngày tháng ở định dạng dd/MM/yyyy HH:mm:ss
                if (typeof date === 'string' && date.includes('T')) {
                    const d = new Date(date);
                    return format(d, 'dd/MM/yyyy HH:mm:ss');
                }
                return date;
            },

            //Cập nhật
            async updateElection(updateElection){
                try{
                    const response = await api.put(`${import.meta.env.VITE_API_ELECTIONS}/${updateElection.ngayBD}`,updateElection);
                    if(response.status === 200){
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Cập nhật kỳ bầu cử thành công'
                        });
                        this.$emit('update-election');
                    }else{
                        throw new Error(response.data.message || 'Cập nhật thất bại');
                    }
                }catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: error.message || 'Đã xảy ra lỗi khi cập nhật kỳ bầu cử'
                    });
                }
            },

            //Xóa 
            async deleteElection(ngayBD){
                try{
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                        //Đính dạng lại ngày
                        console.log("Xóa ngày: ",ngayBD);
                        let [ngay, gio] = ngayBD.split(' ');        //Tách ngày và giờ
                        const ngayMoi = ngay.split('/').reverse().join('-');

                        const response = await api.delete(`/api/Elections/${ngayMoi+' '+gio}`);
                        if (response.status === 200 && response.data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                text: response.data.message
                            });
                            this.$emit('delete-election');

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
                        text: error.message || 'Đã xảy ra lỗi khi xóa kỳ bầu cử'
                    });
                }
            }
        }
    };
</script>

<template>
    <div>
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết Kỳ Bầu Cử</h5>
                        <button type="button" class="btn-close" @click="$emit('close')"></button>
                    </div>
                    <div class="modal-body">
                        <electionForm
                            :election="electionLocal"
                            @submit:election="updateElection"
                            @delete:election="deleteElection"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}
</style>