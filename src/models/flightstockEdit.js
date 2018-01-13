import {getaddAirLine, getdetailAirLine,getpriceAirline} from '../services/api';

export default {
  namespace: 'flightstockEdit',
  state: {
    details: [],//编辑回显数据
    airline: [],//日历数据
    accurate: null,//飞常准数据

  },
  effects: {
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
