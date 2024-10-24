<script>
    import * as yup from 'yup';
    import { Form,Field, ErrorMessage } from 'vee-validate';

    export default{
        components: {
            Form,
            Field,
            ErrorMessage
        },
        props:{
            loginInformation:{type:Object, required:true}
        },
        emits: ['submit:loginInformation'],
        data(){
            const schema = yup.object().shape({
                account: yup.string().required('Vui lòng điền thông tin đăng nhập',),
                password: yup.string().required('Vui lòng điền mật khẩu',),
            });
            return {
                loginInfomationLocal: this.loginInformation,
                schema
            };
        },
        methods:{
            submitLoginInformation(){
                this.$emit('submit:loginInformation', this.loginInfomationLocal);
            }
        }
    };
</script>

<template>
    <div class="container ">
      <div class="shadow rounded row bg-light rounded-top rounded-bottom">
        <div class="col-md-6 pt-5 pl-1 pb-5">
          <img src="../../assets/img/login.jpg" alt="Coding image" class="img-fluid"/>
        </div>
        <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <h2 class="mb-4">Đăng nhập</h2>
          <Form
            @submit="submitLoginInformation"
            :validation-schema="schema"
            v-slot="{ errors }"
            method="post"
          >
            <div class="form-group">
              <label for="account">Tài khoản</label>
              <Field 
                name="account"
                type="text"
                class="form-control" 
                placeholder="Điền tài khoản"
                v-model="loginInfomationLocal.account"
              />
              <ErrorMessage name="account" class="text-danger"/>
            </div>
            <div class="form-group mt-2">
              <label for="password">Mật khẩu</label>
              <Field 
                name="password"
                type="password"
                class="form-control"
                placeholder="Điền mật khẩu"
                v-model="loginInfomationLocal.password"
              />
              <ErrorMessage name="password" class="text-danger"/>
            </div>
            <div class="form-group mt-3">
                <button type="submit" class="btn btn-primary">Đăng nhập</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .container {
    margin-top: 2vh;
  }
  
  .img-fluid {
    max-width: 100%;
    height: auto;
  }
  </style>