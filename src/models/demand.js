import { demandList,fakequest} from '../services/api';

export default {
  namespace: 'demand',
  state: {
    list: {},
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(demandList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      // yield call(fakequest, 1000);
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
  },
};
