/*eslint no-unused-expressions: 0*/
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  //客户管理
  offlineCustomerList,
  offlineCustomerAdd,
  offlineCustomerQuery,
  offlineCustomerEdit,
  offlineCustomerDelete,
  offlineCustomerByCustomerList,
  offlineCustomerRecordQuery, //日志查询

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

const initFormState = () => ({
  //form用
  formData: {
    data: {},
  },
});
const initDetailTableDataState = () => ({
  detailTableData: {
    data: [],
    option: {},
  },
});

const initState = () => {
  return {
    pageType: 'c', //c=>客户 s=>供应商
    data: {
      data: [],
      message: '',
      option: 0,
    },
    loading: true,

    cacheSearchFormData: {
      charge: '',
      contacts: '',
      mobile: '',
      name: '',
      type: '',
      wxqq: '',
    },

    //详情TableData 详情表格用
    detailTableData: {
      data: [],
      option: {},
    },

    //recordData 日志信息
    recordData: {
      data: [],
      loading: false,
    },

    modalData: {
      data: {},
      message: '',
    },
    showModal: false,
    modalFormLoading: false, //模态框中的table的loading
    modalConfirmLoading: false,
    deleteItemId: '', //点击删除的时候存储该值

    ...initFormState(), //form用
    ...initDetailTableDataState(),
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
    //v1.3新增
    *fetchCustomerList({ payload, succCB }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      //eslint-disable-next-line
      const response = yield call(offlineCustomerByCustomerList, payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'saveDetailTableData',
          payload: response,
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchRecordQuery({ payload, succCB }, { call, put }) {
      yield put({
        type: 'saveRecordData',
        payload: { loading: true },
      });
      //eslint-disable-next-line
      const response = yield call(offlineCustomerRecordQuery, payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        yield put({
          type: 'saveRecordData',
          payload: response,
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'saveRecordData',
        payload: { loading: false },
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

        //跳转 客户管理页,这里由于两个交互不一致，但有放在了一起，所以有点混乱，后期另一个页面改过来后，再处理
        if (pageType === 'c') {
          yield put(routerRedux.push('/offline/customerMannagement'));
        }

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
        payload: { modalFormLoading: true, loading: true },
      });
      const pageType = yield select(
        state => state.customerMannagement.pageType
      );
      const response = yield call(transferRes(pageType, 'query'), payload); //offlineSupporterList,offlineCustomerList
      if (response && response.code === 200) {
        if (pageType === 'c') {
          yield put({
            type: 'extendAll',
            payload: { formData: response },
          });
        } else {
          yield put({
            type: 'extendAll',
            payload: { modalData: response },
          });
        }
        succCB && succCB(response.data);
      }
      yield put({
        type: 'extendAll',
        payload: { modalFormLoading: false, loading: false },
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
        if (pageType === 'c') {
          yield put(routerRedux.push('/offline/customerMannagement'));
        }
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
    saveDetailTableData(state, action) {
      return {
        ...state,
        detailTableData: {
          ...state.detailTableData,
          ...action.payload,
        },
      };
    },
    saveRecordData(state, action) {
      return {
        ...state,
        recordData: {
          ...state.recordData,
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
    saveCacheSearchFormData(state, { payload }) {
      return {
        ...state,
        cacheSearchFormData: payload,
      };
    },
    clear() {
      //页面卸载时重置
      return initState();
    },
    clearFormData(state) {
      //add和edit页面卸载时重置
      return {
        ...state,
        ...initFormState(),
      };
    },
    clearDetailTableData(state) {
      return {
        ...state,
        ...initDetailTableDataState(),
      };
    },
  },
};
