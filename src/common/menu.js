const menuData = [{
  name: '客户管理',
  icon: 'idcard',
  path: 'customer',
  children: [{
    name: '客户列表',
    path: 'customer/userList',
  }],
}, {
  name: '政策管理',
  icon: 'form',
  path: 'supplier',
  children: [{
    name: '供应商资源',
    path: 'supplier/supplierPolicy/flightstock',
    // children: [{
    //   name: '供应商列表',
    //   path: 'supplier/supplierPolicy/flightstock',
    // }, {
    //   name: '新增',
    //   path: 'supplier/supplierPolicy/flightstockAdd',
    // }, {
    //   name: '编辑',
    //   path: 'supplier/supplierPolicy/flightstockEdit',
    // }],
  },{
    name: '冷门资源',
    path: 'supplier/supplierPolicy/h5',
  }, {
    name: '飞猪资源',
    path: 'supplier/flyPigList',
  }],
}, {
  name: '拼团管理',
  icon: 'usergroup-add',
  path: 'fightgroups',
  children: [{
    name: '需求池',
    path: 'fightgroups/demand',
    // children: [{
    //   name: '查看需求池',
    //   path: 'fightgroups/demand/:view',
    // }{
    //   name: '查看拼团',
    //   path: 'fightgroups/demand/checkFightGroups/:id',
    // }],
    // children: [
    //   {
    //     name: '推送方案-选择订单',
    //     path: 'fightgroups/demand/choose/:data',
    //   }, {
    //     name: '方案推送',
    //     path: 'fightgroups/demand/push',
    //   }, {
    //     name: '查看历史拼团',
    //     path: 'fightgroups/demand/viewDemand/:data',
    //   }
    // ],
  }, {
    name: '拼团列表',
    path: 'fightgroups/list',
  }],
}, {
  name: '订单管理',
  icon: 'profile',
  path: 'order',
  children: [{
    name: '代销订单',
    path: 'order/flyingpig',
    // children:[{
    //   name:'飞猪&供应商订单详情',
    //   path:'/order/flyingpig/detail/:params',
    // }]
  }, {
    name: '委托订单',
    path: 'order/entrust',
    // children:[{
    //   name:'委托订单详情',
    //   path:'/order/entrust/detail/:params',
    // }]
  }, {
    name: '退款列表',
    path: 'order/refund',
  }],
}, {
  name: '运营管理',
  icon: 'picture',
  path: 'operations',
  children: [{
    name: 'banner图片管理',
    path: 'operations/banner',
    // children:[{
    //   name:'新增banner',
    //   path:'/operations/banner/bannerAdd',
    // },{
    // name:'编辑banner',
    // path:'/operations/banner/bannerEdit',
    // }]
  }],
},
  // {
  //   name: '财务管理',
  //   icon: 'table',
  //   path: 'finance',
  //   children: [{
  //     name: '支付明细',
  //     path: 'finance/finance_payment',
  //   }, {
  //     name: '财务转账审核',
  //     path: 'finance/finance_verify',
  //   }],
  // }, {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [{
  //     name: '基础详情页',
  //     path: 'profile/basic',
  //   }, {
  //     name: '高级详情页',
  //     path: 'profile/advanced',
  //   }],
  // }, {
  //   name: '权限管理',
  //   icon: 'setting',
  //   path: 'rightsManagement',
  //   children: [{
  //     name: '用户管理',
  //     path: 'rightsManagement/RoleManage',
  //   },{
  //     name: '编辑角色',
  //     path: 'rightsManagement/EditRole',
  //   }],
  // },
];

// function formatter(data, parentPath = '') {
//   const list = [];
//   data.forEach((item) => {
//     if (item.children) {
//       list.push({
//         ...item,
//         path: `${parentPath}${item.path}`,
//         children: formatter(item.children, `${parentPath}${item.path}/`),
//       });
//     } else {
//       list.push({
//         ...item,
//         path: `${parentPath}${item.path}`,
//       });
//     }
//   });

//   return list;
// }


// export const getMenuData = () => formatter(menuData);

export const getMenuData = () => menuData
