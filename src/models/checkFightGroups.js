import {queryBasicProfile, queryAdvancedProfile, changeStatus} from '../services/api';
//TODO 这个文件刚刚copy下来，都需修改
export default {
  namespace: 'checkFightGroups',

  state: {
    basicGoods: [],
    basicLoading: true,
    // advancedOperation1: [],
    // advancedOperation2: [],
    // advancedOperation3: [],
    // advancedLoading: true,
    // data: {
    //   xxx: [],
    //   xx: {},
    // },`
    // loading: true,
    showModal: false,
    modalConfirmLoading: false,
    closeReason: '',//关闭的原因
  },

  effects: {
    * fetchBasic(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: {basicLoading: true},
      });
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: {basicLoading: false},
      });
    },
    * fetchAdvanced(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: {advancedLoading: true},
      });
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: {advancedLoading: false},
      });
    },
    * fetchSaveCloseFightGroups({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: {modalConfirmLoading: true},
      });
      console.log("payload", payload);
      const response = yield call(changeStatus, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: {
          modalConfirmLoading: false,
          showModal: false,
        },
      });
    },
    * fetchConfirmExport({payload, callback}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(changeStatus, payload);

      if (response && response.code >= 1) {
        callback && callback(response);
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          modalConfirmLoading: false,
          showModal: false
        },
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
    show(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCloseReason(state, {payload}) {//todo 这几个函数都重复了，提取
      return {
        ...state,
        ...payload,
      };
    },
    changeModalLoading(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
