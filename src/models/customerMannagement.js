import {queryCustomerList} from '../services/api';

export default {
  namespace: 'customerMannagement',

  state: {
    data: {
      data: [],
      msg: '',
      option: {},//这里面会有分页器需要的信息： current、 pageSize、total，但需要转换
    },
    loading: true,
  },
  effects: {
    * fetch({payload}, {call, put}) {//这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCustomerList, payload);
      if (response && response.code >= 1) {//todo 这里应该这样写，其他文件记得也参考这里
        yield put({
          type: 'save',
          payload: response,
        });
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
        data: action.payload,
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
