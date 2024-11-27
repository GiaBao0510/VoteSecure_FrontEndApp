<script>
import electionForm from './electionForm.vue';
import api from '../../services/api.service';
import Swal from "sweetalert2";
import Loading from '../../views/Loading.vue';

export default {
    name: 'AddElection',
    components:{
        electionForm, Loading
    },
    data(){
        return {
            elections:{
                ngayBD: '', 
                ngayKT: '',
                tenKyBauCu: "",
                moTa: "",
                soLuongToiDaCuTri: 0,
                soLuongToiDaUngCuVien: 0,
                soLuotBinhChonToiDa: 0,
                iD_Cap: 0
            },
            isLoading: false
        }
    },
    methods:{
        async addElection(election){
            this.isLoading = true;
            try {
                // Hàm chuyển đổi định dạng ngày giờ
                function formatDateTime(dateTimeStr) {
                    const [datePart, timePart] = dateTimeStr.split(' ');
                    const [day, month, year] = datePart.split('/');
                    return `${year}-${month}-${day}T${timePart}`;
                }

                console.log("ngayBD: ",formatDateTime(election.ngayBD));
                console.log("ngayKT: ",formatDateTime(election.ngayKT));
                const response = await api.post(import.meta.env.VITE_ELECTION_API,{
                    ngayBD: formatDateTime(election.ngayBD), 
                    ngayKT: formatDateTime(election.ngayKT),
                    tenKyBauCu: election.tenKyBauCu,
                    moTa: election.moTa,
                    soLuongToiDaCuTri: election.soLuongToiDaCuTri,
                    soLuongToiDaUngCuVien: election.soLuongToiDaUngCuVien,
                    soLuotBinhChonToiDa: election.soLuotBinhChonToiDa,
                    iD_Cap: Number.parseInt(election.iD_Cap)
                });
                if(response.status === 200){
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm kỳ bầu cử thành công',
                        text: response.data.message ,
                        confirmButtonText: 'Đóng'
                    });
                    this.$emit('election-added');
                } else if(response.status === 400){
                    Swal.fire({
                        icon: 'error',
                        title: 'Thêm kỳ bầu cử thất bại',
                        text: response.data.message ,
                        confirmButtonText: 'Đóng'
                    });
                }
            } catch (error) {
                console.error('Login error:', error);
                const errorMessage = error.response?.data?.message 
                    || error.response?.statusText 
                    || error.message 
                    || 'Đã có lỗi xảy ra';
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: errorMessage,
                    confirmButtonText: 'Đóng'
                });
            } finally {
                this.isLoading = false;
            }
        },
    }
}
</script>

<template>
    <div>
        <electionForm 
            @submit:election="addElection"
            :election="elections"
        />
        <Loading v-if="isLoading" />
    </div>
</template>