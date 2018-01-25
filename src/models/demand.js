import { demandList,fakequest} from '../services/api';

export default {
  namespace: 'demand',
  state: {
    list: {},
    loading: false,
    double:false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const time1 = Date.now();
      const response = yield call(demandList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const time2 = Date.now()
      if(!(time2-time1>2000)){
        yield call(fakequest, 1000);
      }
      yield put({
        type: 'changeDouble',
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
      if(action.payload){
        return {
          ...state,
          loading: action.payload,
          double:action.payload
        };
      }else{
        return {
          ...state,
          loading: action.payload,
        };
      }
    },
    changeDouble(state,{payload}){
      return {
        ...state,
        double:payload
      };
    }
  },
};
