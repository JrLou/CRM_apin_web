import mockjs from 'mockjs';
import { getRule, postRule} from './mock/rule';
import { getUserList} from './mock/userlist';
import { entrust } from './mock/entrust';
import {groupsList,demandList} from './mock/groupsList'
import { getActivities, getNotice, getFakeList } from './mock/api';
import { bannerList } from './mock/bannerList.js';
import {getSuplierList} from './mock/supplierlist';
import {getFlylist} from './mock/flylist';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { getMenus } from './mock/menus.js'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/userList':getUserList,
  'GET /api/bannerList':bannerList,
  'POST /api/groupsList':groupsList,
  'GET /api/deleteBanner':bannerList,
  'GET /api/changeStatus':bannerList,
  'GET /api/suplierList' :getSuplierList,
  'GET /api/flyList' :getFlylist,
  'GET /api/entrust' :entrust,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    res.send({
      status: password === '888888' && userName === 'admin' ? 'ok' : 'error',
      type,
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/notices': getNotices,
  'GET /api/getmenus': getMenus,
  'GET /api/getRefundList': (req, res) => {
    const query = req.query;
    const pageSize = query.pageSize || 10;
    const status = query.status || '@integer(1,2)';
    res.send(mockjs.mock({
      [`list|${pageSize}`]: [{
        id: '@natural',
        status,
        money: '@integer(1,10000)',
        orderId: '@natural',
        time: '@dateTime',
        kefu: '@name',
        beizhu: '备注'
      }],
      total: 100
    }));
  },
  'POST /api/group/postGroupData': (req, res) => {
    res.send({
      code: 1,
      message: 'success'
    });
  },
  'POST /api/group/searchFlights': (req, res) => {
    res.send({
      code: 1,
      message: 'success',
      data: [
        {
          id: 1,
          flightDepAirport: "萧山机场",
          flightDep: "杭州",
          flightDeptimePlanDate: "12:09",
          flightNo: "sn434",
          flightArrAirport: "天河机场",
          flightArr: "武汉",
          flightArrtimePlanDate: "13:00",
          flightCompany: '东方航空公司'
        },
        {
          id: 2,
          flightDepAirport: "萧山机场",
          flightDep: "杭州",
          flightDeptimePlanDate: "12:09",
          flightNo: "sn434",
          flightArrAirport: "天河机场",
          flightArr: "武汉",
          flightArrtimePlanDate: "13:00",
          flightCompany: '东方航空公司'
        },
        {
          id: 3,
          flightDepAirport: "萧山机场",
          flightDep: "杭州",
          flightDeptimePlanDate: "12:09",
          flightNo: "sn434",
          flightArrAirport: "天河机场",
          flightArr: "武汉",
          flightArrtimePlanDate: "13:00",
          flightCompany: '东方航空公司'
        },
        {
          id: 4,
          flightDepAirport: "萧山机场",
          flightDep: "杭州",
          flightDeptimePlanDate: "12:09",
          flightNo: "sn434",
          flightArrAirport: "天河机场",
          flightArr: "武汉",
          flightArrtimePlanDate: "13:00",
          flightCompany: '东方航空公司'
        }
      ]
    });
  },
  'POST /api/group/addFlights': (req, res) => {
    res.send({
      code: 1,
      message: 'success',
    });
  },
  'POST /api/group/demandList':demandList,
};

export default noProxy ? {} : delay(proxy, 1000);
