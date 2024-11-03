<script>
    import shared from '@/services/shared.service';
    export default{
        name:'ComponnetTitle',
        props:{
            ComponnetName: {type: String, default: 'Trang chủ'},
        },
        data(){
            return{
                currentDate: shared.currentDate(),
            };
        },
    }
</script>
<template>
    <div class="row bg-primary bg-gradient p-4 rounded-3 shadow mb-4">
        <div class="col-12 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
                <div>
                    <h1 class="text-white mb-0 fw-bold">{{ ComponnetName }}</h1>
                </div>
            </div>
            <div class="d-flex flex-column align-items-stretch" name="hehe"> 
                <!-- Hiển thị ngày tháng năm -->
                <div class="badge bg-light text-primary text-center fs-6 rounded-pill px-3 w-100 mb-2">
                    {{currentDate}}
                </div>
            </div>
        </div>
    </div>
</template>


