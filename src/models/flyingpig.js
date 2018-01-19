import {getFlylist} from '../services/api';
import {message} from 'antd';

export default {
  namespace: "flyingpigList",
  state: {
    loading: true,
    data:{
      data:[],
      option:{},
    },
  },
  effects: {
    * getList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
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
    },
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        data:payload,
      };
    },
    changeLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

