import { offlineList, orderDetail, delOrder } from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'offline',
  state: {
    list: {},
    usernameData: ['a', 'b', 'c', 'd', 'e'],
    loading: false,
    isDill: false,
    changeInfo: [
    ],
    schemeInfo: [
      { supplier: '', price: '', line: '' }
    ],
    orderDetail: {}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(offlineList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(orderDetail, payload);
      if (response.code == 1) {
        yield put({
          type: 'getDetail',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *delOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(delOrder, payload);
      if (response.code == 200) {
        message.success('操作成功')
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getDetail(state, action) {
      return {
        ...state,
        orderDetail: action.payload.data,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeIsdill(state, action) {
      return {
        ...state,
        isDill: action.payload == '1' ? true : false,
      };
    },
    delOneChange(state, action) {
      let newChangeInfo = state.changeInfo;
      newChangeInfo.splice(action.payload, 1);
      return {
        ...state,
        changeInfo: newChangeInfo
      };
    },
    addOneChange(state, action) {
      state.changeInfo.push(action.payload);
      let newChangeInfo = state.changeInfo;
      return {
        ...state,
        changeInfo: newChangeInfo
      };
    },
    changeChangeInfo(state, action) {
      return {
        ...state,
        changeInfo: action.payload
      };
    },
    addOneScheme(state, action) {
      state.schemeInfo.push({ supplier: '', price: '', line: '' });
      let newSchemeInfo = state.schemeInfo;
      return {
        ...state,
        schemeInfo: newSchemeInfo
      };
    },
    changeSchemeInfo(state, action) {
      return {
        ...state,
        schemeInfo: action.payload
      };
    },
    delOneScheme(state, action) {
      let newSchemeInfo = state.schemeInfo;
      newSchemeInfo.splice(action.payload, 1);
      return {
        ...state,
        schemeInfo: newSchemeInfo
      };
    },
  },
};
