import { createWebHashHistory, createRouter } from "vue-router";
import Login from '@/views/Login.vue';

const routes =[
    //Trang chính (Đăng nhập)
    {
      path: "/",
      name: "Login",
      component: Login,
    },

    //Trang xác thực mã otp
    {
      path: "/verify-otp",
      name: "VerifyOTP",
      component: () => import("@/views/VerifyOTP.vue"),
    },

    //Trang không xác định
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },

    //Trang chính admin
    {
      path: "/admin",
      name: "HomeAdmin",
      component: () => import("@/views/Admin/home.vue"),
      meta: {
        requiresAuth: true,
      },
      children:[
        //Thống kê
        {
          path: 'statistical',
          name: 'Statistical',
        },

        //Kỳ bầu cử
        {
          path: 'elections',
          name: 'Elections',
          component: () => import("@/views/Admin/elections/elections.vue"),
        },

        //Vai trò
        {
          path: 'roles',
          name: 'Roles',
          component: () => import("@/views/Admin/roles/roles.vue"),
        }
      ]

    }

];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;