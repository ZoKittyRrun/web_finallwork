export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { name: '分析页', icon: 'PieChartOutlined', path: '/dashboard', component: './Dashboard' },
  { path: '/account', name: '个人设置', icon: 'user', component: './Account' },
  // {
  //   path: '/admin',
  //   name: '管理页',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     { path: '/admin', redirect: '/admin/addAssignments' },
  //     { path: '/admin/addAssignments', name: '添加新的作业', component: './Admin/addAssignments' },
  //     { path: '/admin/editInfo', name: '修改作业成绩', component: './Admin/editInfo' },
  //   ],
  // },
  {
    name: '健身器材管理',
    path: '/equipmentManagement',
    icon: 'ClockCircleOutlined',
    component: './equipmentMG',
  },
  {
    name: '健身计划管理',
    path: '/fitPlan',
    icon: 'FormOutlined',
    component: './fitPlan',
  },
  {
    name: '健身课程管理',
    path: '/fitCourse',
    icon: 'TeamOutlined',
    component: './fitCourse',
  },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/dashboard' },
  { path: '*', layout: false, component: './404' },
];
