import { routerRedux } from 'dva/router';
import { AccountLogin } from '../services/api';
import CookieHelp from './../utils/cookies';
export default {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(AccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      CookieHelp.clearCookie()
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload && payload.code === 200 && payload.success) {
        payload.data.Authorization = payload.data.accessToken;
        CookieHelp.saveUserInfo(payload.data,true);
        return {
          ...state,
          status: 'ok',
          submitting: false,
        };
      }
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
