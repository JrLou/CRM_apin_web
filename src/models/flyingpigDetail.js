import {getFlyDetail, flyDetailAddTicket,updateSettleAmount,addTicketFail} from '../services/api';
import {message} from "antd/lib/index";
export default {
  namespace: 'flyingpigDetail',

  state: {
    groupVoyage: [],//订单K座信息
    log: [],//日志信息
    order: {},//订单信息
    orderGroup: [],//方案推送记录
    passenger: [],//乘机人信息
    payrecord: [],//支付信息
    loading: true,
  },

  effects: {
    * getDetail({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getFlyDetail, payload);
      if (response && response.code >= 1) {
        yield put({
          type: 'show',
          payload: response,
        });
      } else if (!response) {
        message.error('系统异常')
      } else {
        let msg = response.msg ? response.msg : '请求有误';
        message.error(msg)
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * addTicket({payload,callback}, {call, put}) {
      const response = yield call(flyDetailAddTicket, payload);
      if (callback) {
        callback(response);
      }
    },
    * updateSettleAmount({payload,callback}, {call, put}) {
      const response = yield call(updateSettleAmount, payload);
      if (callback) {
        callback(response);
      }
    },
    * ticketFail({payload,callback}, {call, put}) {
      const response = yield call(addTicketFail, payload);
      if (callback) {
        callback(response);
      }
    }
  },

  reducers: {
    show(state, {payload}) {
      let groupVoyageArr = [];
      if( JSON.stringify(payload.data.groupVoyage) === '{}' || !payload.data.groupVoyage){
        groupVoyageArr = []
      }else{
        groupVoyageArr[0] =  payload.data.groupVoyage;
      }

      return {
        ...state,
        groupVoyage: groupVoyageArr || [],//订单K座信息
        log: payload.data.log || [],//日志信息
        order: payload.data.order || {},//订单信息
        orderGroup: payload.data.orderGroup || [],//方案推送记录
        passenger: payload.data.passenger || [],//乘机人信息
        payrecord: payload.data.payrecord || [],//支付信息
      };
    },
    changeLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};


