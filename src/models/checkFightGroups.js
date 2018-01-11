import {queryBasicProfile, queryAdvancedProfile, changeStatus} from '../services/api';
import {queryOrderInfo,} from '../services/api';
import {message} from 'antd';
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
    groupsInfoData: {},//拼团信息
    groupsInfoLoading: true,

    orderInfoData: {//订单信息
      data: [],
    },
    orderInfoLoading: true,

    logInfoData: {//日志信息
      data: [],
    },
    logInfoLoading: true,

    projectDetailData: {//方案明细
      data: [],
    },
    projectDetailLoading: true,

    modalData: {//保存着当前modal需要的列表信息
      data: [],
    },
    showModal: false,
    modalConfirmLoading: false,
  },

  effects: {
    * fetchGroupsInfo({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {basicLoading: true},
      });
      const response = yield call(queryOrderInfo,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'extendAll',
        payload: {basicLoading: false},
      });
    },
    * fetchBasic({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {basicLoading: true},
      });
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'extendAll',
        payload: {basicLoading: false},
      });
    },
    * fetchAdvanced(_, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {advancedLoading: true},
      });
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'extendAll',
        payload: {advancedLoading: false},
      });
    },
    * fetchSaveCloseFightGroups({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(changeStatus, payload);
      if (response.code >= 1) {
        message.success("保存成功");
      }
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'extendAll',
        payload: {
          modalConfirmLoading: false,
          showModal: false,
        },
      });
    },
    * fetchConfirmExport({payload, callback}, {call, put}) {
      yield put({
        type: 'extendAll',
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
        type: 'extendAll',
        payload: {
          modalConfirmLoading: false,
          showModal: false
        },
      });
    },
  },

  reducers: {
    save(state, action, key) {
      const keyProp = key || 'data';
      return {
        ...state,
        [keyProp]: action.payload,
      };
    },
    show(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    // changeLoading(state, {payload}) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // },
    // saveCloseReason(state, {payload}) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // },
    // changeModalLoading(state, {payload}) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // },
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
    }
  },
};
