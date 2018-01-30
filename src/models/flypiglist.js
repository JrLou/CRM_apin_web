import { queryFlyList, fakequest} from '../services/api';

export default {
  namespace: 'flyPiglist',
  state: {
    loading: false,
    data:{
      data:[],
      option:{},
    },
    double:false
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({type: 'changeDouble', payload:true})
      const time1 = Date.now();
      const response = yield call(queryFlyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const time2 =  Date.now();
      if (!(time >=1000)) {
        yield call(fakequest, 1000);
      }
      yield put({type: 'changeDouble', payload:false})
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
    changeDouble(state, {payload}) {
      return {
        ...state,
        double: payload,
      };
    },
  },
};
