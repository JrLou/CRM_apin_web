import {getaddAirLine, getdetailAirLine,getpriceAirline} from '../services/api';

export default {
  namespace: 'flightstockAdd',
  state: {
    accurate: {},//飞常准数据
    details: null,//编辑回显数据
    airline: []//日历数据
  },
  effects: {
    //飞常准查询
    * addAirLine({payload}, {call, put}) {
      const response = yield call(getaddAirLine, payload)
      yield put({
        type: 'accurates',
        payload: response,
      })
    },
    //编辑回显数据
    * addtailAirLine({payload}, {call, put}) {
      const response = yield call(getdetailAirLine, payload)
      if (response.code >= 1) {
        yield put({
          type: 'detail',
          payload: response,
        })
      }
    },
    //获取日历数据
    * getpriceAirline({payload}, {call, put}) {
      const response = yield call(getpriceAirline, payload)
      if (response.code >= 1) {
        yield put({
          type: 'airline',
          payload: response,
        })
      }
    },
  },
  reducers: {
    accurates(state, action) {
      return {
        ...state,
        accurate: action.payload,
      }
    },
    detail(state, action) {
      return {
        ...state,
        details: action.payload.data,
      }
    },
    airline(state, action) {
      return {
        ...state,
        airline: action.payload.data,
      }
    },
  },
};
