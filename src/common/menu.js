const menuData = [{
  name: '订单管理',
  icon: 'form',
  path: 'order',
  children: [{
    name: '订单出票',
    path: 'ticket',
  }, {
    name: '订单查看',
    path: 'view',
  }, {
    name: '订单确认',
    path: 'confirm',
  }, {
    name: '订单列表',
    path: 'list',
  }],
}, {
  name: '财务管理',
  icon: 'table',
  path: 'finance',
  children: [{
    name: '支付明细',
    path: 'finance_payment',
  }, {
    name: '财务转账审核',
    path: 'finance_verify',
  }],
}, {
  name: '列表页',
  icon: 'table',
  path: 'list',
  children: [{
    name: '查询表格',
    path: 'table-list',
    hideInMenu: true,
  }, {
    name: '标准列表',
    path: 'basic-list',
  }, {
    name: '卡片列表',
    path: 'card-list',
  }, {
    name: '搜索列表',
    path: 'search',
    children: [{
      name: '搜索列表（文章）',
      path: 'articles',
    }, {
      name: '搜索列表（项目）',
      path: 'projects',
    }, {
      name: '搜索列表（应用）',
      path: 'applications',
    }],
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
  children: [{
    name: '基础详情页',
    path: 'basic',
  }, {
    name: '高级详情页',
    path: 'advanced',
  }],
}, {
  name: '权限管理',
  icon: 'table',
  path: 'rightsManagement',
  children: [{
    name: '用户管理',
    path: 'RoleManage',
  }],
},];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
