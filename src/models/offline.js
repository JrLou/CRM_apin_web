import { offlineList, orderDetail, delOrder, addOrder, addChange, searchCustomer, searchSupplier, updateOrder, delSchemeWithid, outExcel } from '../services/api';
import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'offline',
  state: {
    list: {},
    usernameData: [],
    supplierData: [],
    loading: false,
    isDill: false,
    changeInfo: [
    ],
    schemeInfo: [
      { supplierName: '', unitprice: '', flight: '' }
    ],
    originalPlans: [],
    orderDetail: {},
    currentOrder: ''
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
      if (response && response.code == 200) {
        yield put({
          type: 'getDetail',
          payload: { ...response, curId: payload.id },
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
    *addOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addOrder, payload);
      if (response.code == 200) {
        message.success('操作成功');
        yield put(routerRedux.push('/offline/order'));
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateOrder, payload);
      if (response.code == 200) {
        message.success('修改成功');
        yield put(routerRedux.push('/offline/order'));
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addOneChange({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addChange, payload);
      if (response.code == 200) {
        message.success('操作成功');
        yield put({
          type: 'getOneChange',
          payload: payload,
        });

      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *outExcel({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(outExcel, payload);
      if (response.code == 200) {
        message.success('操作成功');
        window.open(response.data.url);
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *searchCustomer({ payload }, { call, put }) {
      const response = yield call(searchCustomer, payload);
      if (response.code == 200) {
        yield put({
          type: 'getCustomers',
          payload: response.data ? response.data : [],
        });
      } else {
        message.error(response.message);
      }
    },
    *searchSupplier({ payload }, { call, put }) {
      const response = yield call(searchSupplier, payload);
      if (response.code == 200) {
        yield put({
          type: 'getSupplier',
          payload: response.data ? response.data : [],
        });
      } else {
        message.error(response.message);
      }
    },
    *delOneSchemeWithid({ payload }, { call, put }) {
      const response = yield call(delSchemeWithid, { id: payload.id });

      if (response.code == 200) {
        yield put({
          type: 'delOneScheme',
          payload: payload.index,
        });
      } else {
        message.error(response.message);
      }
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
        schemeInfo: action.payload.data.plans.length > 0 ? action.payload.data.plans : [{ supplierName: '', unitprice: '', flight: '' }],
        changeInfo: action.payload.data.endorse,
        currentOrder: action.payload.curId,
        originalPlans: action.payload.data.plans
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
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
    getOneChange(state, action) {
      action.payload.handle_date = moment(action.payload.handle_date, 'YYYY-MM-DD');
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
      state.schemeInfo.push({ supplierName: '', unitprice: '', flight: '' });
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
    getCustomers(state, action) {
      return {
        ...state,
        usernameData: action.payload
      };
    },
    getSupplier(state, action) {
      return {
        ...state,
        supplierData: action.payload
      };
    },
  }
};
