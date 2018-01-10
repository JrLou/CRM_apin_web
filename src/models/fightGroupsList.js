import {queryFightGroupsList} from '../services/api';
import {routerRedux} from 'dva/router';
import {message} from 'antd';

export default {
  namespace: 'fightGroupsList',
  state: {
    data: {
      data: [],
      msg: '',
      option: {
        current: 1,
        pageSize: 8,
      },//这里面会有分页器需要的信息： current、 pageSize、total，但需要转换
    },
    loading: true,
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFightGroupsList, payload);
      if (response.code >= 1) {
        message.success('xxx');

        //下面是直接跳转
        // yield put(routerRedux.push('/fightgroups/demand/checkFightGroups/' + payload.id));
      }
      yield put({
        type: 'getTable',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    reset(state, action) {
      return {
        ...state,
        ...payload,
      };
    },

    getTable(state, {payload}) {
      return {
        ...state,
        tableData: payload
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

  },
};
