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
    '/order/ticket': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Order/Ticket')),
    },
    '/order/view': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Order/View')),
    },
    '/order/confirm': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Order/Confirm')),
    },
    '/order/list': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Order/List')),
      // hideInBreadcrumb: true,
      // name: '工作台',
    },
    '/finance/finance_payment': {
      component: dynamicWrapper(app, ['financePaymentList'], () => import('../routes/Finance/FinancePayment')),
    },
    '/finance/finance_verify': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Finance/FinanceVerify')),
    },
      '/customer/userList':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Customer/TableList.js')),
      },
      '/supplier/supplierList':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Supplier/TableList.js')),
      },
      '/fightgroups/demand':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Fightgroups/Demand.js')),
      },
      '/fightgroups/list':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Fightgroups/List.js')),
      },
      '/order/flyingpig':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Flyingpig.js')),
      },
      '/order/entrust':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Entrust.js')),
      },
      '/order/refund':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Order/Refund.js')),
      },
      '/operations/banner':{
        component: dynamicWrapper(app, ['rule'], () => import('../routes/Operations/Banner.js')),
      },

    // '/form/basic-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    // },
    // '/form/step-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    // },
    // '/form/step-form/confirm': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    // },
    // '/form/step-form/result': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    // },
    // '/form/advanced-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    // },
    // '/list/table-list': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    // },
    // '/list/basic-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    // },
    // '/list/card-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    // },
    // '/list/search': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    // },
    // '/list/search/projects': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    // },
    // '/list/search/applications': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    // },
    // '/list/search/articles': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    // },
    // '/profile/basic': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    // },
    // '/profile/advanced': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    // },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
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

    //客户管理
    '/customer/userList': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Customer/UserList')),
    },
    //政策管理
    '/supplier/supplierList': {
      component: dynamicWrapper(app, [], () => import('../routes/Supplier/SupplierList')),
    },
    //运营管理
    '/Operations/Banner': {
      component: dynamicWrapper(app, [], () => import('../routes/Operations/Banner')),
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
