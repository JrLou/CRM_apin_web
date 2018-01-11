import { getRefundList } from '../services/api';

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
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
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
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

