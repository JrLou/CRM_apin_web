import { offlineList, orderDetail, delOrder, addOrder, addChange, searchCustomer, searchSupplier, updateOrder, delSchemeWithid, outExcel, searchCity } from '../services/api';
import { message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'offline',
  state: {
    list: {},
    usernameData: [],
    nameWithMoreInfo: [], //用于显示【客户类型】
    supplierData: [],
    cityData: [],
    cityData2: [],
    loading: false,
    isDill: false,
    changeInfo: [
    ],

    schemeInfo: [
      { supplierName: '', adultUnitprice: '', childUnitprice: '', babyUnitprice: '', flight: '' }
    ],
    originalPlans: [],
    orderDetail: {},
    currentOrder: '',
    totalCustomer: [],
    totalSupplier: []
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(offlineList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchDetail({ payload, succCb = () => {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(orderDetail, payload);
      if (response && response.code == 200) {
        yield put({
          type: 'getDetail',
          payload: { ...response, curId: payload.id },
        });
        succCb();
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *delOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(delOrder, { id: payload.id });
      if (response.code == 200) {
        message.success('操作成功');
        // 重获数据
        let params = payload.listParams;
        // 判断当前页是否只有一条
        if (payload.currentCount === 1 && params.pageNum !== 1) {
          params.pageNum = params.pageNum - 1;
        }
        yield put({
          type: 'fetch',
          payload: params,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addOrder, payload);
      if (response.code == 200) {
        message.success('操作成功');
        yield put(routerRedux.push('/offline/order'));
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateOrder, payload);
      if (response.code == 200) {
        message.success('修改成功');
        yield put(routerRedux.push('/offline/order'));
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addOneChange({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addChange, payload);
      if (response.code == 200) {
        message.success('操作成功');
        yield put({
          type: 'getOneChange',
          payload: payload,
        });
        yield put({
          type: 'isShowModal',
          payload: false,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *outExcel({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(outExcel, payload);
      if (response.code == 200) {
        message.success('操作成功');
        window.location.href = response.data.url;
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *searchCustomer({ payload, succCb }, { call, put }) {
      const response = yield call(searchCustomer, payload);
      if (response.code == 200) {
        const nameArr = response.data.map((v, k) => {
          return v.name;
        });
        const nameWithMoreInfo = response.data.map(v => {
          return {name: v.name, type: v.type, contacts: v.contacts};
        });
        yield put({
          type: 'getCustomers',
          payload: { nameArr, totalCustomer: response.data, nameWithMoreInfo },
        });
        succCb && succCb();
      }
    },
    *searchSupplier({ payload }, { call, put }) {
      const response = yield call(searchSupplier, payload);
      let nameArr = response.data.map((v, k) => {
        return v.name;
      });
      if (response && response.code == 200) {
        yield put({
          type: 'getSupplier',
          payload: { nameArr: nameArr, totalSupplier: response.data },
        });
      }

    },
    *searchCity({ payload }, { call, put }) {
      //当payload.condition === ""空，则不去请求，直接设置为[]；（更合理的交互是，要请求【空】，此时后台返回  热门城市数组）
      if (payload.condition.trim() === "") {
        yield put({
          type: 'getCity',
          payload: { data: [], arrFlag: payload.arrFlag },
        });
        return;
      }

      const response = yield call(searchCity, { condition: payload.condition });
      if (response && response.code == 200) {
        if (response.data.length > 10) { response.data = response.data.splice(0, 10); }
        let citiesArr = response.data.map((v, k) => {
          return v.cityName;
        });
        yield put({
          type: 'getCity',
          payload: { data: citiesArr, arrFlag: payload.arrFlag },
        });
      }
    },
    *delOneSchemeWithid({ payload }, { call, put }) {
      const response = yield call(delSchemeWithid, { id: payload.id });

      if (response && response.code == 200) {
        yield put({
          type: 'delOneScheme',
          payload: payload.index,
        });
      }

    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getDetail(state, action) {
      let newArr = action.payload.data.endorse.map((v, k) => {
        v.handleDate = moment(v.handleDate);
        return v;
      })
      return {
        ...state,
        orderDetail: action.payload.data,
        schemeInfo: action.payload.data.plans.length > 0 ? action.payload.data.plans : [{ supplierName: '', adultUnitprice: '', childUnitprice: '', babyUnitprice: '', flight: '' }],
        changeInfo: newArr,
        currentOrder: action.payload.curId,
        originalPlans: action.payload.data.plans
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    delOneChange(state, action) {
      let newChangeInfo = state.changeInfo;
      newChangeInfo.splice(action.payload, 1);
      return {
        ...state,
        changeInfo: newChangeInfo
      };
    },
    getOneChange(state, action) {
      action.payload.handleDate = moment(action.payload.handleDate, 'YYYY-MM-DD');
      state.changeInfo.push(action.payload);
      let newChangeInfo = state.changeInfo;
      return {
        ...state,
        changeInfo: newChangeInfo
      };
    },
    changeChangeInfo(state, action) {
      return {
        ...state,
        changeInfo: action.payload
      };
    },
    addOneScheme(state, action) {
      state.schemeInfo.push({ supplierName: '', adultUnitprice: '', childUnitprice: '', babyUnitprice: '', flight: '', orderId: action.payload });
      let newSchemeInfo = state.schemeInfo;
      return {
        ...state,
        schemeInfo: newSchemeInfo
      };
    },
    changeSchemeInfo(state, action) {
      return {
        ...state,
        schemeInfo: action.payload
      };
    },
    delOneScheme(state, action) {
      let newSchemeInfo = state.schemeInfo;
      newSchemeInfo.splice(action.payload, 1);
      return {
        ...state,
        schemeInfo: newSchemeInfo
      };
    },
    getCustomers(state, action) {
      return {
        ...state,
        usernameData: action.payload.nameArr,
        nameWithMoreInfo: action.payload.nameWithMoreInfo,
        totalCustomer: action.payload.totalCustomer,
      };
    },
    getCity(state, action) {
      let key = action.payload.arrFlag ? 'cityData2' : 'cityData';
      return {
        ...state,
        [key]: action.payload.data
      };
    },
    getSupplier(state, action) {
      return {
        ...state,
        supplierData: action.payload.nameArr,
        totalSupplier: action.payload.totalSupplier
      };
    },
    resetPlansAndEndorse(state, action) {
      return {
        ...state,
        schemeInfo: [{ supplierName: '', adultUnitprice: '', childUnitprice: '', babyUnitprice: '', flight: '' }],
        changeInfo: [],
      };
    },
    isShowModal(state, action) {
      return {
        ...state,
        isShowModal: action.payload,
      };
    },
    changeSelected(state, action) {
      let newschemeInfo = state.schemeInfo.map((v, k) => {
        if (action.payload == k) {
          v.selected = 1;
        } else {
          v.selected = 0;
        }
        return v;
      });
      return {
        ...state,
        schemeInfo: newschemeInfo,
      };
    },
    resetOrderDetail(state) {
      return {
        ...state,
        orderDetail: {},
      };
    },
  },
};
