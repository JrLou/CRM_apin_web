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
    // 拼团列表
    '/fightgroups/list': {
      component: dynamicWrapper(app, ['fightGroupsList'], () => import('../routes/Fightgroups/FightGroupsList.js')),
    },
    //刘园园 订单管理
    '/order/flyingpig': {
      component: dynamicWrapper(app, ['flyingpig'], () => import('../routes/Order/Flyingpig.js')),
    },
    '/order/flyingpig/detail/:params': {
      name: "代销订单详情",
      component: dynamicWrapper(app, ['flyingpigDetail'], () => import('../routes/Order/FlyingpigDetail.js')),
    },
    '/order/entrust': {
      component: dynamicWrapper(app, ['flyingpig'], () => import('../routes/Order/Entrust.js')),
    },
    '/order/entrust/detail/:params': {
      name: "K座订单详情",
      component: dynamicWrapper(app, ['flyingpigDetail'], () => import('../routes/Order/EntrustProfile.js')),
    },
    '/order/refund': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Order/Refund.js')),
    },
    //异常页
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
    //需求池
    '/fightgroups/demand': {
      component: dynamicWrapper(app, ['demand'], () => import('../routes/Fightgroups/Demand.js')),
    },
    // 查看需求池
    '/fightgroups/demand/viewDemand/:data': {
      name: '查看历史拼团',
      component: dynamicWrapper(app, ['view'], () => import('../routes/Fightgroups/View.js')),
    },
    //推送方案-选择订单
    '/fightgroups/demand/choose/:data': {
      name: "方案推送",
      component: dynamicWrapper(app, ['choose'], () => import('../routes/Fightgroups/Choose.js')),
    },
    //方案推送  杨利波
    '/fightgroups/demand/push': {
      name: "方案推送",
      component: dynamicWrapper(app, ['push'], () => import('../routes/Fightgroups/Push.js')),
    },
    // 查看拼团
    '/fightgroups/demand/checkFightGroups/:id': {
      name: "方案推送",
      component: dynamicWrapper(app, ['checkFightGroups'], () => import('../routes/Fightgroups/CheckFightGroups.js')),
    },
    //客户管理
    '/customer/userList': {
      component: dynamicWrapper(app, ['userList'], () => import('../routes/Customer/UserList')),
    },
    //政策管理
    '/supplier/supplierList': {
      component: dynamicWrapper(app, ['supplierlist'], () => import('../routes/Supplier/SupplierList')),
    },
    //供应商政策
    '/supplier/supplierPolicy/flightstock': {
      name: '供应商资源列表',
      component: dynamicWrapper(app, ['flightstock'], () => import('../routes/Supplier/supplierPolicy/Flightstock')),
    },
    //供应商政策-新增
    '/supplier/supplierPolicy/flightstock/Add': {
      name: '新增供应商',
      component: dynamicWrapper(app, ['flightstockAdd'], () => import('../routes/Supplier/supplierPolicy/FlightstockAdd')),
    },
    //供应商政策-编辑
    '/supplier/supplierPolicy/flightstock/Edit': {
      name: '编辑供应商',
      component: dynamicWrapper(app, ['flightstockEdit'], () => import('../routes/Supplier/supplierPolicy/FlightstockEdit')),
    },
    //供应商政策-查看
    '/supplier/supplierPolicy/flightstock/View': {
      name: '查看供应商',
      component: dynamicWrapper(app, ['flightstockView'], () => import('../routes/Supplier/supplierPolicy/FlightstockView')),
    },
    //飞猪资源
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
    //冷门资源
    '/supplier/supplierPolicy/h5': {
      name:'冷门资源',
      component: dynamicWrapper(app, ['h5List'], () => import('../routes/Supplier/H5/H5List')),
    },
    //冷门资源-编辑
    '/supplier/supplierPolicy/h5/Edit': {
      name:'编辑冷门资源',
      component: dynamicWrapper(app, ['h5Add'], () => import('../routes/Supplier/H5/H5Add')),
    },
    //冷门资源-新增
    '/supplier/supplierPolicy/h5/Add': {
      name:'新增冷门资源',
      component: dynamicWrapper(app, ['h5Add'], () => import('../routes/Supplier/H5/H5Add')),
    },
    //运营管理
    '/operations/banner': {
      component: dynamicWrapper(app, ['bannerList'], () => import('../routes/Operations/Banner.js')),
    },
    //banner添加/编辑
    '/operations/banner/bannerAdd': {
      name: '新增banner',
      component: dynamicWrapper(app, ['bannerList'], () => import('../routes/Operations/BannerAdd.js')),
    },
    '/operations/banner/bannerEdit': {
      name: '编辑banner',
      component: dynamicWrapper(app, ['bannerList'], () => import('../routes/Operations/BannerView.js')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
    '/offline/order': {
      name: '线下订单列表',
      component: dynamicWrapper(app, ['offline'], () => import('../routes/Offline/OfflineList.js')),
    },
    '/offline/order/addOrder': {
      name: '新增订单',
      component: dynamicWrapper(app, ['offline'], () => import('../routes/Offline/AddOrder.js')),
    },
    '/offline/order/ViewOrder/:id': {
      name: '查看订单',
      component: dynamicWrapper(app, ['offline'], () => import('../routes/Offline/ViewOrder.js')),
    },
    '/offline/order/EditOrder/:id': {
      name: '修改订单',
      component: dynamicWrapper(app, ['offline'], () => import('../routes/Offline/EditOrder.js')),
    },
    '/offline/customerMannagement': {
      name: '客户（旅行社）管理',
      component: dynamicWrapper(app, ['customerMannagement'], () => import('../routes/CustomerMannagement/CustomerMannagement.js')),
    },
    '/offline/customerMannagement/add': {
      name: '新增客户',
      component: dynamicWrapper(app, ['customerMannagement'], () => import('../routes/CustomerMannagement/AddCustomer.js')),
    },
    '/offline/customerMannagement/edit/:id': {
      name: '修改客户',
      component: dynamicWrapper(app, ['customerMannagement'], () => import('../routes/CustomerMannagement/EditCustomer.js')),
    },
    '/offline/customerMannagement/detail/:data': {
      name: '客户详情页',
      component: dynamicWrapper(app, ['customerMannagement'], () => import('../routes/CustomerMannagement/Detail.js')),
    },
    '/offline/supporterMannagement': {
      name: '供应商管理',
      component: dynamicWrapper(app, ['customerMannagement'], () => import('../routes/SupporterMannagement/SupporterMannagement.js')),
    },
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
