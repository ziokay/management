import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const register = {
    path: '/register',
    name: 'register',
    meta: {
        title: '注册',
    },
    component: () =>
        import ('@/views/register.vue')
}

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: {
                i18n: 'home'
            },
            name: 'home_index',
            // mate: {
            //     rquireAuth: true
            // },
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            // mate: {
            //     rquireAuth: true
            // },
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: '/',
        icon: 'clipboard',
        name: 'component',
        title: '今日菜单',
        component: Main,
        // mate: {
        //     rquireAuth: true
        // },
        children: [{
            path: 'today-menu',
            name: 'file-upload',
            title: '今日菜单',
            component: () => 
                import ('@/views/home/home.vue')
            
        }, ]
    },
    {
        path: '/',
        name: 'tables',
        title: '饭桌人员列表',
        component: Main,
        // mate: {
        //     rquireAuth: true
        // },
        children: [{
            path: 'table-list',
            title: '饭桌人员列表',
            name: 'result',
            icon: 'edit',
            component: () => 
                import ('@/views/tables/table-list.vue')
            
        }, ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    register,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];