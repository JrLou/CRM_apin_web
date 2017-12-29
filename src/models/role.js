import { getV2RoleFunctionList } from '../services/role';
export default {
  namespace: "role",
  state: {
    roleList:[]
  },
  effects: {
    *fetchV2RoleFunctionList({ payload }, { call, put }) {
      debugger
      const response = yield call(getV2RoleFunctionList)
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

