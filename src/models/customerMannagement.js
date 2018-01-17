import {offlineCustomerList, offlineCustomerAdd, offlineCustomerQuery, offlineCustomerEdit, offlineCustomerDelete} from '../services/api';//offlineSupplierList, offlineSupplierAdd
import {message} from 'antd';

const initState = () => {
  return {
    data: {
      data: [],
      message: '',
      option: 0,
    },
    loading: true,

    modalData: {
      data: {},
      message: '',
    },
    showModal: false,
    modalFormLoading: false,//模态框中的table的loading
    modalConfirmLoading: false,
    deleteItemId:'',//点击删除的时候存储该值
  };
};

export default {
  namespace: 'customerMannagement',

  state: initState(),
  effects: {
    * fetch({payload, succCB}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(offlineCustomerList, payload);//offlineSupplierList,offlineCustomerList
      if (response && response.code >= 1) {
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
    * fetchAdd({payload, succCB}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(offlineCustomerAdd, payload);//offlineSupplierAdd,offlineCustomerAdd
      if (response && response.code >= 1) {
        yield put({
          type: 'extendAll',
          payload: {showModal: false},
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: false},
      });
    },
    * fetchQueryOne({payload, succCB}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: {modalFormLoading: true},
      });
      const response = yield call(offlineCustomerQuery, payload);//offlineSupplierList,offlineCustomerList
      if (response && response.code >= 1) {
        yield put({
          type: 'extendAll',
          payload: {modalData:response},
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'extendAll',
        payload: {modalFormLoading:false},
      });
    },
    * fetchEdit({payload, succCB}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(offlineCustomerEdit, payload);//offlineSupplierList,offlineCustomerList
      if (response && response.code >= 1) {
        yield put({
          type: 'extendAll',
          payload: {showModal: false},
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: false},
      });
    },
    * fetchDelete({payload, succCB}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(offlineCustomerDelete, payload);//offlineSupplierList,offlineCustomerList
      if (response && response.code >= 1) {
        yield put({
          type: 'extendAll',
          payload: {showModal: false},
        });
        message.success(response.message);
        succCB && succCB();
      }
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: false},
      });
    },
  },
  reducers: {
    saveTableData(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
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
    extendAll(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {//页面卸载时重置
      return initState();
    }
  },
};
