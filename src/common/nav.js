import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        path: 'home',
        name: '首页',
        hidden: true,

        component: dynamicWrapper(app, ['chart','home'], () => import('../routes/Pages/Home')),
      },
      {
        name: '客户管理',
        path: 'Customer',
        icon: 'reload',
        children: [
          {
            name: '旅行社',
            path: 'Agencies',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '供应商',
            path: 'Supplier',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },{
            name: '用户信息',
            path: 'UserInfoList',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          }
        ],
      },
      {
        name: '询价管理',
        path: 'inquiry',
        icon: 'table',
        children: [
          {
            name: '散票出价',
            interface:"接口111111111",
            path: 'SuppliersList',
            component: dynamicWrapper(app, [], () => import('../routes/Detail/SuppliersList.js')),
            children:[{
              name:'添加供应商',
              hidden:true,
              path:'AddSuppliers',
              component: dynamicWrapper(app, [], () => import('../routes/Detail/AddSuppliers.js')),
            }]
          },{
            name: '测试CRM接口',
            interface:"gyw22222",
            path: 'GroupTicket',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/Detail/SuppliersList.js')),
          },
        ],
      },
      {
        name: '采购订单',

        path: 'order',

        icon: 'idcard',
        children: [
          {
            name: '散票订单',
            interface:"gyw3333",
            path: 'Smallgroup',
            component: dynamicWrapper(app, ['smallgroupData'], () => import('../routes/Detail/SuppliersList.js')),
            children:[{
              name:'散票订单详情',
              hidden:true,
              path:':id',
              component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
            }]
          },{
            name: '团票订单',
            path: 'Biggroup',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/Purchaseorder/Biggroup.js')),
            children:[{
              name:'订单查看',
              hidden:true,
              path:':id', //因为 要发送ID过去请求数据
              component: dynamicWrapper(app, ['rule'], () => import('../routes/Purchaseorder/Biggroup.js')),
            }]
          },
        ],
      },
      {
        name: '财务管理',
        path: 'financiallist',

        icon: 'pay-circle-o',
        children: [
          {
            name: '旅行社转账审核',
            path: 'OfflineSettlementList',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js'))

          },{
            name: '支付明细查询',
            path: 'Financialmanagemen',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },
        ],
      },
      {
        name: '政策管理',
        path: 'list4',
        icon: 'table',
        children: [
          {
            name: '库存信息',
            path: 'Flightstock',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '测试CRM接口',
            path: 'table-list2',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },
        ],
      },
      {
        name: '权限管理',
        path: 'list5',

        icon: 'team',
        children: [
          {
            name: '权限列表',
            path: 'RightList',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '角色管理',
            path: 'RoleManage',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },
        ],
      },
      {
        name: '数据中心',
        path: 'list6',

        icon: 'area-chart',
        children: [
          {
            name: '价格对比',
            path: 'ComparePrice',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '历史价格',
            path: 'HistoryPrice',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },{
            name: '航线运力',
            path: 'AirlineCapacity',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },
        ],
      },
      {
        name: '运营管理',
        path: 'list7',
        icon: 'table',
        children: [
          {
            name: '城市配置',
            path: 'CityConfig',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '航司配置',
            path: 'FlightCom',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          }, {
            name: '精品航线配置',
            path: 'HighQualityFlight',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/MyTableList/MyPage.js')),
          },{
            name: '供应商',
            path: 'Suppliers',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList2')),
          },
        ],
      },
      {
        name: '异常',
        path: 'exception',
        icon: 'warning',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          }
        ],
      },
    ],
  },
];
