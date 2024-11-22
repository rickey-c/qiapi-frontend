export default [
  // 主页路由 
  { path: '/', name: '接口调用', icon: 'api', component: './Index' },
  // 接口信息路由 
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo', hideInMenu: true },
  // 个人信息路由
  { path: '/userInfo', name: '个人信息', icon: 'user', component: './User/Info'},
  // 订单路由
  {
    path: '/order',
    name: '我的订单',
    icon: 'profile', 
    component: './Order',
  },
  // 登录路由
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  // 注册路由
  {
    path: '/user',
    layout: false,
    routes: [{ name: '注册', path: '/user/register', component: './User/Register' }],
  },
  // 支付路由
  // {
  //   path: '/interface_info/order/:id/', 
  //   name: '支付', 
  //   icon: 'wallet', 
  //   component: './Pay', 
  //   hideInMenu: true
  // },
  
  // 管理路由
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