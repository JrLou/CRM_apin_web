import { getFlylist } from '../services/flyingpig';

export default {
  namespace: "flyingpig",
  state: {
    loading: true,
    list: [],
    total: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getFlylist, payload);
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
        list: payload.list,
        total: payload.pagination.total,
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

