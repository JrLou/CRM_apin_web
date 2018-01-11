import {getFlyDetail,flyDetailAddTicket} from '../services/api';

export default {
  namespace: 'flyingpigDetail',

  state: {
    groupVoyage: {},//订单委托信息
    log: [],//日志信息
    order: {},//订单信息
    orderGroup: [],//方案推送记录
    passenger: [],//乘机人信息
    payrecord: [],//支付信息
    loading: true,
    ticketLoading:true,
    ticketResponse:{},
  },

  effects: {
    * getDetail({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getFlyDetail, payload);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addTicket({payload}, {call, put}){
      yield put({
        type: 'ticketLoading',
        payload: true,
      });
      const response = yield call(flyDetailAddTicket, payload);
      yield put({
        type: 'ticket',
        payload: response,
      });
      yield put({
        type: 'ticketLoading',
        payload: false,
      });
    }
  },

  reducers: {
    show(state, {payload}) {
      return {
        ...state,
        groupVoyage: payload.data.groupVoyage || {},//订单委托信息
        log: payload.data.log || [],//日志信息
        order: payload.data.order || {},//订单信息
        orderGroup: payload.data.orderGroup || [],//方案推送记录
        passenger: payload.data.passenger || [],//乘机人信息
        payrecord: payload.data.payrecord || [],//支付信息
      };
    },
    ticket(state, {payload}) {
      return {
        ...state,
        ticketResponse:payload
      };
    },
    changeLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
      };
    },
    ticketLoading(state, {payload}) {
      return {
        ...state,
        ticketLoading: payload,
      };
    },
  },
};


