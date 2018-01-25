import {getFlylist,fakequest} from '../services/api';
import {message} from 'antd';

export default {
  namespace: "flyingpigList",
  state: {
    loading: true,
    data:{
      data:[],
      option:{},
    },
    double:false,
  },
  effects: {
    * getList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const time1 = Date.now();
      const response = yield call(getFlylist, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else if (!response) {
        message.error('系统异常')
      } else {
        let msg = response.msg ? response.msg : '请求有误';
        message.error(msg)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const time2 = Date.now();
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
    save(state, {payload}) {
      return {
        ...state,
        data:payload,
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

