import { orderList,logList } from '../services/api';

export default {
  namespace: 'choose',
  state: {
    loading: true,
    tableData: {},
    logData:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(orderList, payload);
      yield put({
        type: 'getTable',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getLogs({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(logList, payload);
      yield put({
        type: 'showLog',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    getTable(state, { payload }) {
      return {
        ...state,
        tableData: payload
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    showLog(state, { payload }) {
      return {
        ...state,
        logData: payload
      };
    },
  },
};

