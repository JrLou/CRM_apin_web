import {flightstockList,stateAirLine,getAirLineLogs} from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'flightstock',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    log: [],
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(flightstockList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * changeStatus({payload},{call,put}){
      //列表页，改变上架下架状态
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(stateAirLine, payload);

      const response =yield call(flightstockList)
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * log({payload},{call,put}){
      //日志
      const response =yield call(flightstockList)
      yield put({
        type: 'log',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    log(state, action) {
      return {
        ...state,
        log: action.payload,
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
