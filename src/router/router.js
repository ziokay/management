import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('@/views/login/login.vue')
};

export const signupRouter = {
    path: '/signup',
    name: 'signup',
    meta: {
        title: '注册商家',
    },
    component: () => import('@/views/signup/signup.vue')
}

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            // title: {
            //     i18n: 'home'
            // },
            name: 'home_index',
            component: () => import('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace',
            component: () => import('@/views/own-space/own-space.vue')
        },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/hotel',
        icon: 'clipboard',
        name: 'hotel',
        title: '店家信息',
        component: Main,
        children: [
            {
                path: 'detail',
                name: 'hotel-detail',
                title: '店家信息',
                component: () => import('@/views/hotel/detail.vue')
            }
        ]
    },
    {
        path: '/menu',
        icon: 'clipboard',
        name: 'menu',
        title: '菜单发布',
        component: Main,
        children: [
            {
                path: 'detail',
                name: 'menu-setting',
                title: '菜单发布',
                component: () => import('@/views/menu/setting.vue')
            }
        ]
    },
    {
        path: '/table',
        name: 'table',
        title: '饭桌订单',
        icon: 'edit',
        component: Main,
        children: [
            {
                path: 'list',
                title: '饭桌订单',
                name: 'table-list',
                component: () => import('@/views/table/list.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    signupRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
