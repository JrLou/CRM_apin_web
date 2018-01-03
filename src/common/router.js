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
    '/finance/finance_payment': {
      component: dynamicWrapper(app, ['financePaymentList'], () => import('../routes/Finance/FinancePayment')),
    },
    '/finance/finance_verify': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Finance/FinanceVerify')),
    },
    '/fightgroups/demand': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Fightgroups/Demand.js')),
    },
    '/fightgroups/list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Fightgroups/List.js')),
    },
    '/order/flyingpig': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Flyingpig.js')),
    },
    '/order/entrust': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Entrust.js')),
    },
    '/order/entrust/:id': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Exception/500')),
    },
    '/order/refund': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Refund.js')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
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

    //客户管理
    '/customer/userList': {
      component: dynamicWrapper(app, ['userList'], () => import('../routes/Customer/UserList')),
    },
    //政策管理
    '/supplier/supplierList': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/SupplierList')),
    },
    '/supplier/flyPigList': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/FlyPigList')),
    },
    //运营管理
    '/Operations/Banner': {
      component: dynamicWrapper(app, ['from'], () => import('../routes/Operations/Banner')),
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
