import { queryFlyList } from '../services/api';

export default {
  namespace: 'flyPiglist',
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
      const response = yield call(queryFlyList, payload);
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
        list: payload.data,
        total: payload.option.total,
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
