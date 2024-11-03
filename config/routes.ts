export default [
  // 主页路由 
  { path: '/', name: '主页', icon: 'smile', component: './Index' },
  // 接口信息路由 
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo', hideInMenu: true },
  // 登录路由
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  // 充值路由
  {
    path: '/pay',
    name: '充值',
    icon: 'wallet',
    component: './Pay', // 添加支付页面组件
  },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { name: '接口管理', icon: 'table', path: '/admin/interface_info', component: './Admin/InterfaceInfo' },
      { name: '接口分析', icon: 'analysis', path: '/admin/interface_analysis', component: './Admin/InterfaceAnalysis' },
    ],
  },

  { path: '*', layout: false, component: './404' },
];
