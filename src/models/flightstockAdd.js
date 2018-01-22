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
    code: []
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
    * getsearchAirportes({payload}, {call, put}) {
      //根据三字码查询机场
      const responseA = yield call(getsearchAirport, {code: payload.code[0]})
      const responseB = yield call(getsearchAirport, {code: payload.code[1]})
      if (responseA && responseB && responseA.code >= 1 && responseB.code >= 1) {
        yield put({
          type: 'codes',
          payload: {code: [responseA, responseB]},
        })
      }  else {
        message.warning('请输入正确的机场三字码');
        return
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
    codes(state, action) {
      return {
        ...state,
        code: action.payload.code,
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
