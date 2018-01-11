import {queryAdvancedProfile, changeStatus} from '../services/api';//这个要删除的
import {queryOrderInfo, planClose} from '../services/api';
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
    groupsInfoData: {//拼团信息
      code: '',
      data: [],
      msg: '',
    },
    groupsInfoLoading: true,

    orderInfoData: {//订单信息
      code: '',
      data: [],
      msg: '',
    },
    orderInfoLoading: true,

    logInfoData: {//日志信息
      code: '',
      data: [],
      msg: '',
    },
    logInfoLoading: true,

    projectDetailData: {//方案明细
      code: '',
      data: [],
      msg: '',
    },
    projectDetailLoading: true,

    modalData: {//保存着当前modal需要的列表信息
      code: '',
      data: [],
      msg: '',
    },
    showModal: false,
    modalConfirmLoading: false,
  },

  effects: {
    * fetchGroupsInfo({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {groupsInfoLoading: true},
      });
      const response = yield call(queryOrderInfo, payload);
      console.log("queryOrderInfo的res!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", response);
      yield put({
        type: 'save',
        payload: response,
        key: "groupsInfoData",
      });
      yield put({
        type: 'extendAll',
        payload: {groupsInfoLoading: false},
      });
    },
    * fetchBasic({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {basicLoading: true},
      });
      const response = {};//yield call(queryBasicProfile);
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
    * fetchPlanClose({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(planClose, payload);
      if (response.code >= 1) {
        message.success("保存成功");
        yield put({
          type: 'extendAll',
          payload: {
            modalConfirmLoading: false,
            showModal: false,
          },
        });
      } else {
        message.error("保存失败");
      }

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
    save(state, action) {
      const keyProp = action.key || 'data';
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
