import { getRefundList,offlineRefund,retryRefund } from '../services/api';

export default {
  namespace: "refund",
  state: {
    loading: true,
    list: [],
    total: 0,
    offlineResponse:{},
    retryResponse:{},
  },
  effects: {
    *getList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getRefundList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *offlineRefund({ payload,callback }, { call, put }) {
      const response = yield call(offlineRefund, payload);
      yield put({
        type: 'offline',
        payload: response,
      });
    },
    *retryRefund({ payload,callback }, { call, put }) {
      const response = yield call(retryRefund, payload);
      yield put({
        type: 'retry',
        payload: response,
      });
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
    offline(state, { payload }) {
      return {
        ...state,
        offlineResponse:payload
      };
    },
    retry(state, { payload }) {
      return {
        ...state,
        retryResponse:payload
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

