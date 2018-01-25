import { queryFightGroupsList } from "../services/api";

export default {
  namespace: "fightGroupsList",
  state: {
    listData: {},
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true,
      });
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
  },
};
