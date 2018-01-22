import {geth5, stateAirLine, getAirLineLogs,} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'h5List',
  state: {
    list: {
      data: [],
      option: {},
    },
    loading: true,
    logs: {},
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(geth5, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
    * changeStatus({payload}, {call, put}) {
      //列表页，改变上架下架状态
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const judgment = yield call(stateAirLine, payload.status);
      if (judgment && judgment.code >= 1) {
        message.success('上架成功');
      }
      const response = yield call(geth5, payload.filter)
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }

    },
    * loglist({payload}, {call, put}) {
      //日志
      const response = yield call(getAirLineLogs, payload)
      if (response && response.code >= 1) {
        yield put({
          type: 'log',
          payload: response,
        });
      }
    },

  },
  reducers: {
    save(state, action) {
      if (action.payload.option) {
        return {
          ...state,
          list: action.payload,
        };
      }
    },
    log(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
