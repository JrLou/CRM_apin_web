// import { xxx } from '../services/xxx';
export default {
  namespace: "flyingpig",
  state: {
    loading: true,
    list: [],
    total: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
      };
    },
  },
};

