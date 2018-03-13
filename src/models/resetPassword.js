import { message } from 'antd';
import { resetPassword } from '../services/api';

export default {
  namespace: 'resetPassword',

  state: {
    loading: false,
  },

  effects: {
    *fetch({ payload, succCB = () => {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(resetPassword, payload);
      if (response && response.code > 0) {
        message.success(response.msg);
        succCB();
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
