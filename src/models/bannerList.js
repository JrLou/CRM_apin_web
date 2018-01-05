import {queryBanner,deleteBanner,changeStatus} from '../services/api';
import {routerRedux} from 'dva/router';

export default {
  namespace: 'bannerList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    editData:{

    },
    loading: true,
  },

  effects:
    {
      * fetch({payload}, {call, put}) {
        //列表页，请求数据
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
        //列表页，删除一个banner
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
        //列表页，改变上架下架状态
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
      },
      * toAdd({payload},{call,put}){
        //列表页，跳转到添加/编辑页面
        yield put({
          type: 'changeEditData',
          payload:payload,
        });
        yield put(routerRedux.push('/operations/bannerEdit'))
      },
      * cancelEdit({payload},{call,put}){
        //取消编辑，跳转到列表页
        yield put({
          type: 'changeEditData',
          payload:{},
        });
        yield put(routerRedux.push('/operations/banner'))
      },
      * checkEdit({payload},{call,put}){
        //确定编辑，成功以后跳转到列表页
        yield put({
          type: 'changeEditData',
          payload:{},
        });
        yield put(routerRedux.push('/operations/banner'))
      }
    },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeEditData(state, action){
      return {
        ...state,
        editData: action.payload,
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
