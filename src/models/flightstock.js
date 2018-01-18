import {flightstockList, stateAirLine, getAirLineLogs, getaddAirLine, getdetailAirLine} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'flightstock',
  state: {
    list: {
      data: [],
      option: {},
    },
    loading: true,
    logs: {},
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(flightstockList, payload);
      if(response && response.code >= 1){
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
    * changeStatus({payload}, {call, put}) {
      //列表页，改变上架下架状态
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const judgment = yield call(stateAirLine, payload);
      if (judgment && judgment.code >= 1) {
        message.success('上架成功');
      }
      const response = yield call(flightstockList, {p: 1, pc: 10})
      if(response && response.code >= 1){
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      } else {
        message.warning(payload.msg);
        return
      }

    },
    * loglist({payload}, {call, put}) {
      //日志
      const response = yield call(getAirLineLogs, payload)
      if (response && response.code >= 1) {
        yield put({
          type: 'log',
          payload: response,
        });
      } else {
        message.warning(payload.msg);
        return
      }
    },

  },
  reducers: {
    save(state, action) {
      if (action.payload.option) {
        return {
          ...state,
          list: action.payload,
        };
      }
    },
    log(state, action) {
      return {
        ...state,
        logs: action.payload,
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
