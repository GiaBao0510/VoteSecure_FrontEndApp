<template>
    <div class="container-fluid d-flex align-items-center justify-content-center vh-100 vw-100">
        <div class="row w-100 text-center">
            <div class="col-sm py-5 vh-100 d-flex align-items-center">
                <img src="../assets/img/notfound.png" class="w-50 d-block mx-auto" alt="Not Found" style="height: auto;">
            </div>
            <div class="col-sm mt-4 d-flex flex-column align-items-center justify-content-center">
                <h3 class="TieuDeLoi">Oops! Page not found</h3>
                <h4>Sorry, but the page you are looking for was not found. Please, make sure you have typed the correct URL.</h4>
                <router-link to="/" class="btn btn-primary mt-3 ">Go to Home</router-link>
            </div>
        </div>
    </div>
</template>

<style>
    .TieuDeLoi {
        color: gray;
        font-size: 2.4em;
        font-weight: 550;
    }
    .col-sm.py-5.vh-100 {
        background: linear-gradient(to right, #7caef8, #2f5df3); /* Màu gradient */
        background-size: cover; /* Chỉnh kích thước gradient cho phù hợp với div */
    }
</style>
