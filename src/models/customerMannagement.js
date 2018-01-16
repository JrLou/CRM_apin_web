import {offlineCustomerList,offlineCustomerAdd} from '../services/api';

const initState = () => {
  return {
    data: {
      data: [],
      msg: '',
      option: {},//这里面会有分页器需要的信息： current、 pageSize、total，但需要转换
    },
    loading: true,

    modalData: {
      code: '',
      data: [],
      msg: '',
    },
    showModal: false,
    modalTableLoading: false,//模态框中的table的loading
    modalConfirmLoading: false,
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
      const response = yield call(offlineCustomerList, payload);
      if (response && response.code >= 1) {//todo 这里应该这样写，其他文件记得也参考这里
        yield put({
          type: 'save',
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
      debugger;
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(offlineCustomerAdd, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'save',
          payload: response,
        });
        succCB && succCB(response.data);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    save(state, action) {
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
