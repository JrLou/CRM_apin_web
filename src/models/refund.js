import { getRefundList,offlineRefund,retryRefund } from '../services/api';
import {message} from 'antd';
export default {
  namespace: "refund",
  state: {
    loading: true,
    list: [],
    total: 0,
  },
  effects: {
    *getList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getRefundList, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else if (!response) {
        message.error('系统异常')
      } else {
        let msg = response.msg ? response.msg : '请求有误';
        message.error(msg)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *offlineRefund({ payload,callback }, { call, put }) {
      const response = yield call(offlineRefund, payload);
      if (callback) {
        callback(response);
      }
    },
    *retryRefund({ payload,callback }, { call, put }) {
      const response = yield call(retryRefund, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload.data||[],
        total: payload.option.total||0,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

