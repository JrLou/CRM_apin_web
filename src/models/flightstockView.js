import {getdetailAirLine, getpriceAirline,} from '../services/api';

export default {
  namespace: 'flightstockView',
  state: {
    details: [],//编辑回显数据
    airline: [],//日历数据
    accurate: null,//飞常准数据
    ajaxJudgment: false,
    logs: {},
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
      if (response.code > 0) {
        yield put({
          type: 'airline',
          payload: response,
        })
      }
    },
    //请求成功回调判断
    * ajaxJu({payload}, {call, put}) {
      yield put({
        type: 'ajaxJudg',
        payload: payload,
      })
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
    log(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
    ajaxJudg(state, action) {
      return {
        ...state,
        ajaxJudgment: action.payload.ajaxJudgment,
      }
    }
  },
};
