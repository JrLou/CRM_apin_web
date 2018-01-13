import {queryMenus, authrouteApi} from '../services/api';
import CookieHelp from './../utils/cookies';
import {routerRedux} from 'dva/router';
import {debug} from 'util';

export default {
  namespace: 'global',
  state: {
    collapsed: false,
    menusload: false,
    menusloaderr: false,
    menus: [],
    routerdata: [],
    routerPath: [{path: 'welcome', url: "welcome"}, {url: 'supplier/supplierPolicy/flightstock/Edit'}],
    authlist: {
      "customer/userList": {},
      "supplier/supplierPolicy/flightstock": {},
      "fightgroups/demand": {},
      "fightgroups/list": {},
      "order/flyingpig": {},
      "order/entrust": {},
      "order/refund": {},
      "operations/banner": {}
    } // 用于权限控制的数据表
  },

  effects: {
    * fetchMenus(_, {call, put}) {
      yield put({
        type: 'changeMenusLoading',
        payload: true,
      });
      const res = yield call(queryMenus);
      if (res && res.code >= 1) {
        const {data} = res
        yield put({
          type: 'changerouterPathData',
          payload: data
        })
        data.forEach(item => item.path = item.url)
        let menus_children = data.filter(item => !item.parentId).map((element, index, arr) => {
          let children = data.filter(item => item.parentId == element.id)
          element.children = children
          return element
        });
        yield put({
          type: 'changeMenusData',
          payload: menus_children
        })
        yield put({
          type: 'changeMenusload',
          payload: true
        })
      } else {
        CookieHelp.clearCookie()
        yield put(routerRedux.push('/user/login'));
      }
    },
    * authroute({payload}, {call, put, select}) {
      const routerPath = yield select(state => state.global.routerPath);
      const id = routerPath.filter(item => item.parentId && payload.indexOf(item.path) > -1)[0].id
      const res = yield call(authrouteApi, {id});
      if (res && res.code >= 1) {
        const {data} = res
        yield put({
          type: 'changerouterPathData',
          payload: data
        })
      }
    }
  },
  reducers: {
    changeLayoutCollapsed(state, {payload}) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeMenusload(state, {payload}) {
      return {
        ...state,
        menusload: payload,
      };
    },
    changeMenusData(state, {payload}) {
      return {
        ...state,
        menus: payload,
      };
    },
    changerouterPathData(state, {payload}) {
      return {
        ...state,
        routerPath: state.routerPath.concat(payload),
      };
    }
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
