import {getaddAirLine, geth5Add, getdetailAirLine, geth5Edit, getsearchAirport} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'h5Add',
  state: {
    accurate: {},//飞常准数据
    numbering: null,
    visible: false,
    ok: '',
    judgment: false,
    details: [],//编辑回显数据
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
    //编辑回显数据
    * addtailAirLine({payload}, {call, put}) {
      const response = yield call(getdetailAirLine, payload)
      if (response && response.code >= 1) {
        yield put({
          type: 'detail',
          payload: response,
        })
      }
    },
    //编辑
    * geteditAirlines({payload}, {call, put}) {
      const response = yield call(geth5Edit, payload)
      if (response && response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'judgme',
          payload: {judgmentes: true},
        })
      }
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
      const response = yield call(geth5Add, payload)
      if (response && response.code >= 1) {
        message.success('操作成功')
        yield put({
          type: 'judgme',
          payload: {judgmentes: true},
        })
      }
    },
    * judgmentesd({payload}, {call, put}) {
      yield put({
        type: 'judgme',
        payload: payload,
      })
    },
    * detailsadd({payload}, {call, put}) {
      yield put({
        type: 'detailsadder',
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
    detail(state, action) {
      return {
        ...state,
        details: action.payload.data,
      }
    },
    detailsadder(state, action) {
      return {
        ...state,
        details: [],
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
    judgme(state, action) {
      return {
        ...state,
        judgment: action.payload.judgmentes,
      }
    },
  },
};
