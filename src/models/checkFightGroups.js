import {changeStatus} from '../services/api';//这个要删除的
import {queryOrderInfo, planClose, queryGroupOrders, queryPublishLogs, queryDetailGroupVoyage, queryGroupLogs, } from '../services/api';
import {message} from 'antd';
//TODO 这个文件刚刚copy下来，都需修改
export default {
  namespace: 'checkFightGroups',
  state: {
    //拼团信息
    groupsInfoData: {
      code: '',
      data: {},
      msg: '',
    },
    groupsInfoLoading: true,

    //订单信息
    groupOrdersData: {
      code: '',
      data: [],
      msg: '',
    },
    groupOrdersLoading: true,

    //方案明细
    detailGroupVoyage: {
      code: '',
      data: [{},{}],
      msg: '',
    },
    detailGroupVoyageLoading: true,

    //日志信息
    groupLogs: {
      code: '',
      data: [],
      msg: '',
    },
    groupLogsLoading: true,

    //保存着当前modal需要的列表信息
    modalData: {
      code: '',
      data: [],
      msg: '',
    },
    showModal: false,
    modalTableLoading: true,//模态框中的table的loading
    modalConfirmLoading: false,
  },

  effects: {
    * fetchGroupsInfo({payload}, {call, put}) {// 获取拼团信息
      yield put({
        type: 'extendAll',
        payload: {groupsInfoLoading: true},
      });
      const response = yield call(queryOrderInfo, payload);
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
    * fetchPlanClose({payload}, {call, put}) {
      yield put({
        type: 'extendAll',
        payload: {modalConfirmLoading: true},
      });
      const response = yield call(planClose, payload);
      if (response.code >= 1) {
        message.success("拼团已关闭");
        yield put({
          type: 'extendAll',
          payload: {
            modalConfirmLoading: false,
            showModal: false,
          },
        });
        yield put({
          type: 'fetchGroupsInfo',
          payload: payload
        });
      } else {
        message.error("保存失败");
      }
    },

    * fetchGroupOrders({payload}, {call, put}) {// 获取订单信息
      yield put({
        type: 'extendAll',
        payload: {groupOrdersLoading: true},
      });
      const response = yield call(queryGroupOrders, payload);
      yield put({
        type: 'save',
        payload: response,
        key: "groupOrdersData",
      });
      yield put({
        type: 'extendAll',
        payload: {groupOrdersLoading: false},
      });
    },
    * fetchPublishLogs({payload}, {call, put}) {// 获取订单推送日志
      yield put({
        type: 'extendAll',
        payload: {modalTableLoading: true},
      });
      const response = yield call(queryPublishLogs, payload);
      yield put({
        type: 'save',
        payload: response,
        key: "modalData",
      });
      yield put({
        type: 'extendAll',
        payload: {modalTableLoading: false},
      });
    },

    * fetchDetailGroupVoyage({payload}, {call, put}) {// 获取方案明细
      yield put({
        type: 'extendAll',
        payload: {detailGroupVoyageLoading: true},
      });
      const response = yield call(queryDetailGroupVoyage, payload);
      yield put({
        type: 'save',
        payload: response,
        key: "detailGroupVoyage",
      });
      yield put({
        type: 'extendAll',
        payload: {detailGroupVoyageLoading: false},
      });
    },

    * fetchGroupLogs({payload}, {call, put}) {// 获取日志信息
      yield put({
        type: 'extendAll',
        payload: {groupLogsLoading: true},
      });
      const response = yield call(queryGroupLogs, payload);
      yield put({
        type: 'save',
        payload: response,
        key: "groupLogs",
      });
      yield put({
        type: 'extendAll',
        payload: {groupLogsLoading: false},
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
