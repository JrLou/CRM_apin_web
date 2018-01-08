import { queryBasicProfile, queryAdvancedProfile, changeStatus } from '../services/api';
//TODO 这个文件刚刚copy下来，都需修改
export default {
  namespace: 'checkFightGroups',

  state: {
    basicGoods: [],
    basicLoading: true,
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    advancedLoading: true,
    // data: {
    //   xxx: [],
    //   xx: {},
    // },`
    // loading: true,
    modalConfirmLoading:false,
  },

  effects: {
    *fetchBasic(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: true },
      });
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: false },
      });
    },
    *fetchAdvanced(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: true },
      });
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: false },
      });
    },
    *fetchSaveCloseFightGroups({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { modalConfirmLoading: true },
      });
      console.log("payload",payload);
      const response = yield call(changeStatus, payload);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { modalConfirmLoading: false },
      });//todo 这里如果请求异常了，不应该再走下一步，记得处理
      yield put({
        type: 'changeModalLoading',
        payload: { modalLoading: false },
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeModalLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
