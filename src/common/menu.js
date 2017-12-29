const menuData = [{
  name: '客户管理',
  icon: 'idcard',
  path: 'Customer',
  children: [{
    name: '用户列表',
    path: 'customer/userList',
  }],
}, {
  name: '政策管理',
  icon: 'form',
  path: 'supplier',
  children: [{
    name: '供应商资源',
    path: 'supplier/supplierList',
  }],
}, {
  name: '拼团管理',
  icon: 'usergroup-add',
  path: 'list',
  children: [{
    name: '需求池',
    path: 'list/card-list',
  }, {
    name: '拼团列表',
    path: 'list/basic-list',
  }],
}, {
  name: '订单管理',
  icon: 'profile',
  path: 'order',
  children: [{
    name: '飞猪/代销订单',
    path: 'order/confirm',
  }, {
    name: '委托订单',
    path: 'order/list',
  }, {
    name: '退款列表',
    path: 'order/list',
  }],
}, {
  name: '运营管理',
  icon: 'picture',
  path: 'operations',
  children: [{
    name: 'banner图片管理',
    path: 'operations/banner',
  }],
},  {
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
  icon: 'setting',
  path: 'rightsManagement',
  children: [{
    name: '用户管理',
    path: 'rightsManagement/RoleManage',
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
