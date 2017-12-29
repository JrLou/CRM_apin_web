import { queryMenus } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    menusload:false,
    menus:[],
  },

  effects: {
    *fetchMenus(_, { call, put }) {
      yield put({
        type: 'changeMenusLoading',
        payload: true,
      });
      const data = yield call(queryMenus);
      yield put({
        type: 'saveMenus',
        payload: data,
      });
    },
    // *clearNotices({ payload }, { put, select }) {
    //   yield put({
    //     type: 'saveClearedNotices',
    //     payload,
    //   });
    //   const count = yield select(state => state.global.notices.length);
    //   yield put({
    //     type: 'user/changeNotifyCount',
    //     payload: count,
    //   });
    // },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveMenus(state, { payload }) {
      return {
        ...state,
        menus: payload&&payload.data?payload.data:[],
        menusload: true,
      };
    },
    // saveClearedNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: state.notices.filter(item => item.type !== payload),
    //   };
    // },
    changeMenusLoading(state, { payload }) {
      return {
        ...state,
        menusload: true,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
