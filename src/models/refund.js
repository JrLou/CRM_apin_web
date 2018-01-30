import {getRefundList, offlineRefund, retryRefund, fakequest} from '../services/api';
import {message} from 'antd';

export default {
  namespace: "refund",
  state: {
    loading: true,
    data: {
      data: [],
      option: {},
    },
    double: false,
  },
  effects: {
    * getList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const time1 = Date.now();
      const response = yield call(getRefundList, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const time2 = Date.now();
      if (!(time2 - time1 > 2000)) {
        yield call(fakequest, 1000);
      }
      yield put({
        type: 'changeDouble',
        payload: false,
      });
    },
    * offlineRefund({payload, callback}, {call, put}) {
      const response = yield call(offlineRefund, payload);
      if (callback) {
        callback(response);
      }
    },
    * retryRefund({payload, callback}, {call, put}) {
      const response = yield call(retryRefund, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        data: payload,
      };
    },
    changeLoading(state, action) {
      if (action.payload) {
        return {
          ...state,
          loading: action.payload,
          double: action.payload
        };
      } else {
        return {
          ...state,
          loading: action.payload,
        };
      }
    },
    changeDouble(state, {payload}) {
      return {
        ...state,
        double: payload
      };
    }
  },
};

