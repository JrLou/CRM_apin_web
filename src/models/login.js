import { routerRedux } from 'dva/router';
import { AccountLogin } from '../services/api';
import CookieHelp from './../utils/cookies';
import {SetItem} from './../utils/localStorage';
import {Base64} from 'js-base64'
export default {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload,callBack}, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(AccountLogin, payload);
      if (response && response.code >=1) {
        // CookieHelp.saveUserInfo(null,response.data.token,true);
        // 保存用户名
        const userName = Base64.encodeURI(response.data.user.account)
        CookieHelp.saveUserInfo('_u',userName,true);
        SetItem('refreshToken',response.data.token.refreshToken)
        callBack()
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout({payload}, { put }) {
      CookieHelp.clearCookie()
      window.location.reload()
      yield put(routerRedux.push('/user/login'+'?from='+encodeURIComponent(payload)));
    },
  },

  reducers: {
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
