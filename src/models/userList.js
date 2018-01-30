import { queryCustomerList, fakequest } from "../services/api";

export default {
  namespace: "userList",

  state: {
    data: {
      data: [],
      msg: "",
      option: {}, //这里面会有分页器需要的信息： current、 pageSize、total，但需要转换
    },
    loading: false,
    double: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      //这里的 { call, put } 好像相当于 { ???, mapDispatchToProps}
      yield put({
        type: "changeLoading",
        payload: true,
      });
      yield put({
        type: "changeDouble",
        payload: true,
      });
      const time1 = Date.now();
      const response = yield call(queryCustomerList, payload);
      if (response && response.code >= 1) {
        yield put({
          type: "save",
          payload: response,
        });
      }
      yield put({
        type: "changeLoading",
        payload: false,
      });
      const time2 = Date.now();
      const time = time2 -time1
      if (!(time2 - time1 > 2000)) {
        yield call(fakequest, 1000);
      }
      yield put({
        type: "changeDouble",
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
    changeDouble(state, action) {
      return {
        ...state,
        double: action.payload,
      };
    },
  },
};
