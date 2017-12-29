const menuData = [{
  name: '订单管理',
  icon: 'form',
  path: 'order',
  children: [{
    name: '订单出票',
    path: 'order/ticket',
  }, {
    name: '订单查看',
    path: 'order/view',
  }, {
    name: '订单确认',
    path: 'order/confirm',
  }, {
    name: '订单列表',
    path: 'order/list',
  }],
}, {
  name: '财务管理',
  icon: 'table',
  path: 'finance',
  children: [{
    name: '支付明细',
    path: 'finance/finance_payment',
  }, {
    name: '财务转账审核',
    path: 'finance/finance_verify',
  }],
}, {
  name: '列表页',
  icon: 'table',
  path: 'list',
  children: [{
    name: '查询表格',
    path: 'list/financetable-list',
    // hideInMenu: true,
  }, {
    name: '标准列表',
    path: 'list/basic-list',
  }, {
    name: '卡片列表',
    path: 'list/card-list',
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
  children: [{
    name: '基础详情页',
    path: 'profile/basic',
  }, {
    name: '高级详情页',
    path: 'profile/advanced',
  }],
}, {
  name: '权限管理',
  icon: 'table',
  path: 'rightsManagement',
  children: [{
    name: '用户管理',
    path: 'rightsManagement/RoleManage',
    path: 'RoleManage',
  },{
    name: '编辑角色',
    path: 'rightsManagement/editRole',
  }],
},];

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

export const getMenuData =()=>menuData
