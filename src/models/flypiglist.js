import { queryFlyList } from '../services/api';

export default {
  namespace: 'flyPiglist',
  state: {
    loading: false,
    data:{
      data:[],
      option:{},
    },
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
        data:payload,
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
