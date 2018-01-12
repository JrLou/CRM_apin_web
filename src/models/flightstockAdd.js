import {getaddAirLine, getdetailAirLine,getpriceAirline} from '../services/api';

export default {
  namespace: 'flightstockAdd',
  state: {
    accurate: {},//飞常准数据
    numbering:null,
  },
  effects: {
    //飞常准查询
    * addAirLine({payload}, {call, put}) {
      yield put({
        type: 'numbering',
        payload: payload,
      })
      const response = yield call(getaddAirLine, payload)
      yield put({
        type: 'accurates',
        payload: response,
      })
    },

  },
  reducers: {
    numbering(state, action) {
      console.log("标识在这李")
      console.log(action.payload.numbering)
      return {
        ...state,
        numbering: action.payload.numbering,
      }
    },
    accurates(state, action) {

      return {
        ...state,
        accurate: action.payload,
      }
    },
  },
};
