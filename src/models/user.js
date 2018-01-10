import CookieHelp from './../utils/cookies';
import {Base64} from 'js-base64'
export default {
  namespace: 'user',
  state: {
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
    const response = Base64.decode(CookieHelp.getCookieInfo('_u'))
    currentUser
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
