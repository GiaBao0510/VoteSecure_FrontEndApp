<template>
  <div class="gocPhai">
      <button class="btn btn-outline-success" type="button" >Đăng ký</button>
      <button class="btn btn-outline-primary" type="button" >Đăng nhập</button>
      <button class="btn btn-outline-danger" type="button" >Đăng xuất</button>
  </div>
  <div class="PhanDau">
      <div class="header">
          <div class="TieuDe_header">
              <h1>
                  <button  class=" DinhDangMauNutHome">Library</button>
              </h1>
          </div>
          <div class="nutUser_header">
              <p class="iconUser">
                  <i class="fa-solid fa-user"></i>
              </p>
          </div>
      </div>
  </div>
</template>



<style>
.PhanDau{
  background-color: rgb(19, 31, 41);
  width: 100vw;
  height: 12vh;
  align-content: center;
  justify-content: center;
}
.header{
  display: grid;
  grid-template-areas: 
  "tieude tieude  nutKiemtra";
}
.TieuDe_header{
  margin-left: 5vh;
  grid: "tieude";
  text-align: left;
  font-size: 1.15em;
  font-weight: 700;
  font-family: Arial ;
  color: rgb(20, 56, 218);
}
.nutUser_header{
  grid: "nutKiemtra";
  margin-left: 5vh;
  text-align: end;
}
.iconUser{
  color: azure;
  font-size: 1.5em;
}
.fa-user{
  padding: 8px;
}
.fa-user:hover{
  background-color: rgb(32, 29, 214);
  padding: 8px;
  border-radius: 100%;
  cursor: pointer;
}
.NutCoiTaiKhoan{
  font-family: arial ;
  font-size: 18px;
  cursor: pointer;
}
.NutCoiTaiKhoan:hover{
  color: aliceblue;
}
.gocPhai{
  display: block;
  width: 100vw;
  text-align: end;
  margin-bottom: 1vh;
}
.gocPhai button{
  margin-left: 2vh;
}
.DinhDangMauNutHome{
  font-family: Arial;
  font-weight: 600;
  border: 1px solid rgb(38, 38, 228);
  color: rgb(32, 32, 175);
  background-color: rgba(16, 85, 124, 0.13);
  padding: 0vh 2vh 0vh 2vh;
  border-radius: 3px;
}
.DinhDangMauNutHome:hover{
  color: rgb(12, 12, 199);
  background-color: rgba(7, 82, 126, 0.13);
}
</style>