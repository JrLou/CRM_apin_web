import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/welcome': {
      component: dynamicWrapper(app, [], () => import('../routes/welcome.js')),
    },
    '/finance/finance_payment': {
      component: dynamicWrapper(app, ['financePaymentList'], () => import('../routes/Finance/FinancePayment')),
    },
    '/finance/finance_verify': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Finance/FinanceVerify')),
    },
    '/fightgroups/demand': {
      component: dynamicWrapper(app, ['demand'], () => import('../routes/Fightgroups/Demand.js')),
    },
    '/fightgroups/list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Fightgroups/List.js')),
    },
    '/order/flyingpig': {
      component: dynamicWrapper(app, ['flyingpig'], () => import('../routes/Order/Flyingpig.js')),
    },
    '/order/flyingpigDetail/:id': {
      component: dynamicWrapper(app, ['flyingpigDetail'], () => import('../routes/Order/FlyingpigDetail.js')),
    },
    '/order/entrust': {
      component: dynamicWrapper(app, ['entrust'], () => import('../routes/Order/Entrust.js')),
    },
    '/order/entrust/entrustProfile':{
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Order/EntrustProfile.js')),
    },
    // '/order/entrust/entrustProfile': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/Exception/EntrustProfile')),
    // },
    '/order/refund': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Order/Refund.js')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/order/entrust/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    //刘园园  权限管理
    '/RightsManagement/RoleManage': {
      component: dynamicWrapper(app, ['roleManageList'], () => import('../routes/RightsManagement/RoleManage')),
    },
    '/RightsManagement/EditRole': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/RightsManagement/EditRole')),
    },
    // 查看需求池
    '/fightgroups/demand/id': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Fightgroups/View.js')),
    },
    //推送方案-选择订单
    '/fightgroups/demand/choose': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Fightgroups/Choose.js')),
    },
    //方案推送
    '/fightgroups/demand/push': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Fightgroups/Push.js')),
    },
    // 查看拼团
    '/fightgroups/demand/result': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Fightgroups/Result.js')),
    },
    //客户管理
    '/customer/userList': {
      component: dynamicWrapper(app, ['userList'], () => import('../routes/Customer/UserList')),
    },
    //政策管理
    '/supplier/supplierList': {
      component: dynamicWrapper(app, ['supplierlist'], () => import('../routes/Supplier/SupplierList')),
    },
    '/supplier/flyPigList': {
      component: dynamicWrapper(app, ['flypiglist'], () => import('../routes/Supplier/FlyPigList')),
    },
    //录入资源
    '/supplier/supplierList/typeIn': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/TypeIn')),
    },
    //编辑资源
    '/supplier/supplierList/edit': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/Edit')),
    },
    //航班库存价格
    '/supplier/supplierList/price': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/Price')),
    },
    //运营管理
    '/Operations/Banner': {
      component: dynamicWrapper(app, ['bannerList'], () => import('../routes/Operations/Banner.js')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
