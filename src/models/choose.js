import { orderList, logList, continueAdd } from '../services/api';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'choose',
  state: {
    loading: true,
    tableData: {},
    logData: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(orderList, payload);

      yield put({
        type: 'getTable',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getLogs({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(logList, payload);
      yield put({
        type: 'showLog',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *continueAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(continueAdd, payload);
      if (response.code == 1) {
        // 继续添加成功回到详情页
        yield put(routerRedux.push('/fightgroups/demand/checkFightGroups/' + payload.groupId));
      } else {
        message.error(response.msg);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    getTable(state, { payload }) {
      return {
        ...state,
        tableData: payload
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    showLog(state, { payload }) {
      return {
        ...state,
        logData: payload
      };
    },
  },
};

