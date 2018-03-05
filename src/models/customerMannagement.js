/*eslint no-unused-expressions: 0*/
import { message } from 'antd';
import {
  //客户管理
  offlineCustomerList,
  offlineCustomerAdd,
  offlineCustomerQuery,
  offlineCustomerEdit,
  offlineCustomerDelete,

  //供应商管理
  offlineSupporterList,
  offlineSupporterAdd,
  offlineSupporterQuery,
  offlineSupporterEdit,
  offlineSupporterDelete,
} from '../services/api'; //offlineSupporterList, offlineSupplierAdd

// const
const transferRes = (pageType, methodName) => {
  let response = null;
  if (pageType === 'c') {
    switch (methodName) {
      case 'list':
        response = offlineCustomerList;
        break;
      case 'add':
        response = offlineCustomerAdd;
        break;
      case 'query':
        response = offlineCustomerQuery;
        break;
      case 'edit':
        response = offlineCustomerEdit;
        break;
      case 'delete':
        response = offlineCustomerDelete;
        break;
      default:
        break;
    }
  } else {
    switch (methodName) {
      case 'list':
        response = offlineSupporterList;
        break;
      case 'add':
        response = offlineSupporterAdd;
        break;
      case 'query':
        response = offlineSupporterQuery;
        break;
      case 'edit':
        response = offlineSupporterEdit;
        break;
      case 'delete':
        response = offlineSupporterDelete;
        break;
      default:
        break;
    }
  }
  return response;
};

let connectInfoKey = 0; //给connectInfo的每一项提供的key
const initState = () => {
  return {
    pageType: 'c', //c=>客户 s=>供应商
    data: {
      data: [],
      message: '',
      option: 0,
    },
    loading: true,

    connectInfo: [{ contacts: '', mobile: '', wxqq: '', key: connectInfoKey }], //给新增的表达使用

    modalData: {
      data: {},
      message: '',
    },
    showModal: false,
    modalFormLoading: false, //模态框中的table的loading
    modalConfirmLoading: false,
    deleteItemId: '', //点击删除的时候存储该值
  };
};

export default {
  namespace: 'customerMannagement',

  state: initState(),
  effects: {
    *fetch({ payload, succCB }, { call, put, select }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'list'), payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'saveTableData',
          payload: response,
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchAdd({ payload, succCB }, { call, put, select }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: true },
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'add'), payload); //offlineSupporterAdd,offlineCustomerAdd
      if (response && response.code === 200) {
        yield put({
          type: 'extendAll',
          payload: { showModal: false },
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: false },
      });
    },
    *fetchQueryOne({ payload, succCB }, { call, put, select }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: { modalFormLoading: true },
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'query'), payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'extendAll',
          payload: { modalData: response },
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'extendAll',
        payload: { modalFormLoading: false },
      });
    },
    *fetchEdit({ payload, succCB }, { call, put, select }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: true },
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'edit'), payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'extendAll',
          payload: { showModal: false },
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: false },
      });
    },
    *fetchDelete({ payload, succCB }, { call, put, select }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: true },
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'delete'), payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'extendAll',
          payload: { showModal: false },
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: { modalConfirmLoading: false },
      });
    },
  },
  reducers: {
    saveTableData(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    /**
     * 展开所有传过来的属性
     * 把上面重复了的几个函数都提取成这个
     * @param state
     * @param payload
     * @returns {{}}
     */
    extendAll(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      //页面卸载时重置
      return initState();
    },
    //V1.3的更改
    addOneConnect(state, action) {
      const { connectInfo } = state;
      const newConnectInfo = [
        ...connectInfo,
        {
          contacts: '',
          mobile: '',
          wxqq: '',
          key: (connectInfoKey += 1),
        },
      ];
      return {
        ...state,
        connectInfo: newConnectInfo,
      };
    },
    delOneConnect(state, { payload }) {
      const { connectInfo } = state;
      const newConnectInfo = connectInfo.filter(currV => {
        return currV.key !== payload.key;
      });
      return {
        ...state,
        connectInfo: newConnectInfo,
      };
    },
    changeConnectInfo(state, { payload }) {
      return {
        ...state,
        connectInfo: payload,
      };
    },
  },
};
