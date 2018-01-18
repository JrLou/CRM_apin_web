import { getdetailAirLine, getpriceAirline, getmodifyPrice,getmodifyInventory,getmodifyDays,getimportFile,geteditAirline,stateAirLine,getAirLineLogs,getLogAirLine} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'flightstockEdit',
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
      if (response&&response.code >= 1) {
        yield put({
          type: 'detail',
          payload: response,
        })
      }
    },
    //获取日历数据
    * getpriceAirline({payload}, {call, put}) {
      const response = yield call(getpriceAirline, payload)
      if (response&&response.code >= 1) {
        yield put({
          type: 'airline',
          payload: response,
        })
      }
    },
    //批量修改团期价格
    * getmodifyPricees({payload}, {call, put}) {
      const response = yield call(getmodifyPrice, payload)
      if (response&&response.code >= 1) {
        message.success('操作成功')
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
      if (response&&response.code >= 1) {
        message.success('操作成功')
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
      if (response&&response.code >= 1) {
        message.success('操作成功')
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
      if (response&&response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    //编辑
    * geteditAirlines({payload}, {call, put}) {
      const response = yield call(geteditAirline, payload)
      if (response&&response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    //上架
    * getstateAirLines({payload}, {call, put}) {
      const response = yield call(stateAirLine, payload)
      if (response&&response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'ajaxJudg',
          payload: {
            ajaxJudgment: true,
          },
        })
      }
    },
    * loglist({payload}, {call, put}) {
      //日志
      const response = yield call(getAirLineLogs, payload)
      yield put({
        type: 'log',
        payload: response,
      });
    },
    * LogAirLine({payload}, {call, put}) {
      //日志添加
      const response = yield call(getLogAirLine, payload)
      if (response&&response.code >= 1) {
        message.success('操作成功')
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
