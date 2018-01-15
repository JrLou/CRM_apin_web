import { offlineList } from '../services/api';

export default {
  namespace: 'offline',
  state: {
    list: {},
    usernameData: ['a', 'b', 'c', 'd', 'e'],
    loading: false,
    isDill: false
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(offlineList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeIsdill(state, action) {
      return {
        ...state,
        isDill: action.payload == '1' ? true : false,
      };
    },
  },
};
