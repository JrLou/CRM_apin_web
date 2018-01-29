import {getaddAirLine, getadd, getsearchAirport} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'flightstockAdd',
  state: {
    accurate: {},//飞常准数据
    numbering: null,
    visible: false,
    ok: '',
    judgment: false,
  },
  effects: {
    //飞常准查询
    * addAirLine({payload}, {call, put}) {
      yield put({
        type: 'clearAdd',
        payload: payload,
      })
      const response = yield call(getaddAirLine, payload)
      if (response && response.code >= 1 && response.data) {
        yield put({
          type: 'accurates',
          payload: response,
        })
        yield put({
          type: 'numbering',
          payload: payload,
        })
        yield put({
          type: 'oktxt',
          payload: {ok: "选择航班"},
        })
      } else {
        yield put({
          type: 'oktxt',
          payload: {ok: "手工录入"},
        })
      }
      yield put({
        type: 'visibles',
        payload: {visible: true},
      })
    },
    * visiblebs({payload}, {call, put}) {
      yield put({
        type: 'visibles',
        payload: payload,
      })
    },
    * clearAdds({payload}, {call, put}) {
      yield put({
        type: 'clearAdd',
        payload: payload,
      })
    },
    * getaddtit({payload}, {call, put}) {
      const response = yield call(getadd, payload)
      if (response && response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'judgmentes',
          payload: {judgmentes: true},
        })
      }
    },

    * judgmentesdobj({payload}, {call, put}) {
      yield put({
        type: 'judgmentes',
        payload: payload,
      })
    }
  },
  reducers: {
    numbering(state, action) {
      return {
        ...state,
        numbering: action.payload.numbering,
      }
    },
    oktxt(state, action) {
      return {
        ...state,
        ok: action.payload.ok,
      }
    },
    accurates(state, action) {
      return {
        ...state,
        accurate: action.payload,
      }
    },
    clearAdd(state, action) {
      return {
        ...state,
        accurate: {},
        numbering: null,
      }
    },
    visibles(state, action) {
      return {
        ...state,
        visible: action.payload.visible,
      }
    },

    judgmentes(state, action) {
      return {
        ...state,
        judgment: action.payload.judgmentes,
      }
    },
  },
};
