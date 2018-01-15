import {getaddAirLine, getdetailAirLine, getpriceAirline, getmodifyPrice,getmodifyInventory,getmodifyDays,getimportFile} from '../services/api';

export default {
  namespace: 'flightstockEdit',
  state: {
    details: [],//编辑回显数据
    airline: [],//日历数据
    accurate: null,//飞常准数据
    ajaxJudgment: false,
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
    //批量修改团期价格
    * getmodifyPricees({payload}, {call, put}) {
      const response = yield call(getmodifyPrice, payload)
      if (response.code >= 1) {
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    //批量修改团期库存
    * getmodifyInventoryes({payload}, {call, put}) {
      const response = yield call(getmodifyInventory, payload)
      if (response.code >= 1) {
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    //批量修改清位时间
    * getgetmodifyDayses({payload}, {call, put}) {
      const response = yield call(getmodifyDays, payload)
      if (response.code >= 1) {
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    //批量批量修改价格
    * getimportFilees({payload}, {call, put}) {
      const response = yield call(getimportFile, payload)
      if (response.code >= 1) {
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
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
    ajaxJudg(state, action) {
      return {
        ...state,
        ajaxJudgment: action.payload.ajaxJudgment,
      }
    }
  },
};
