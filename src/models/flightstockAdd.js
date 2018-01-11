import {getaddAirLine, getdetailAirLine} from '../services/api';

export default {
  namespace: 'flightstockAdd',
  state: {
    accurate: {},//飞常准数据
    details: {}//编辑回显数据
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
      console.log('wo jiushi  su')
      console.log(response)
      if (response.code >= 1) {
        yield put({
          type: 'detail',
          payload: response.data,
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
        details: action.payload,
      }
    },
  },
};
