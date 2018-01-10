import {flightstockList, stateAirLine, getAirLineLogs, getaddAirLine} from '../services/api';
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
    accurate: [],
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(flightstockList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * changeStatus({payload}, {call, put}) {
      //列表页，改变上架下架状态
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const judgment = yield call(stateAirLine, payload);
      if (judgment.payload.code >= 1) {
        message.warning('上架成功');
      }
      const response = yield call(flightstockList, {p: 1, pc: 10})
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * loglist({payload}, {call, put}) {
      //日志
      const response = yield call(getAirLineLogs, payload)
      yield put({
        type: 'log',
        payload: response,
      });
    },
    //飞常准查询
    * addAirLine({payload}, {call, put}) {
      const response = yield call(getaddAirLine, payload)
      console.log(response)
      yield put({
        type:''
      })
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
    accurate(state, action) {
      return {
        ...state,
        accurate: action.payload,
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
