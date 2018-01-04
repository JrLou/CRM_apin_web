import {queryBanner,deleteBanner,changeStatus} from '../services/api';

export default {
  namespace: 'bannerList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  effects:
    {
      * fetch({payload}, {call, put}) {
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryBanner, payload);
        yield put({
          type: 'save',
          payload: response.data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      },
      * delete({payload,callback},{call,put}){
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(deleteBanner, payload);
        if(callback){
          callback(response);
        }
        yield put({
          type: 'save',
          payload: response.data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      },
      * changeStatus({payload,callback},{call,put}){
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(changeStatus, payload);
        if(callback){
          callback(response);
        }
        yield put({
          type: 'save',
          payload: response.data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
