import { queryUserList } from '../services/api';

export default {
  namespace: 'supplierlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserList, payload);
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
    save(state, action) {
      return {
        ...state,
        data:action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
