import { queryFightGroupsList, fakequest } from "../services/api";

export default {
  namespace: "fightGroupsList",
  state: {
    listData: {},
    loading: false,
    double: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true,
      });
      yield put({
        type: "changeDouble",
        payload: true,
      });
      const time1 = Date.now();
      const response = yield call(queryFightGroupsList, payload);
      if (response.code >= 1) {
        yield put({
          type: "getList",
          payload: response,
        });
      }
      yield put({
        type: "changeLoading",
        payload: false,
      });
      const time2 = Date.now();
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
    getList(state, { payload }) {
      return {
        ...state,
        listData: payload,
      };
    },

    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    changeDouble(state, { payload }) {
      return {
        ...state,
        double: payload,
      };
    },
  },
};
