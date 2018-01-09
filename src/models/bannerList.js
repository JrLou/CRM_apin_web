import {queryBanner,deleteBanner,changeStatus,baseImg} from '../services/api';
import {routerRedux} from 'dva/router';

export default {
  namespace: 'bannerList',

  state: {
    data  : {

    },
    editData:{

    },
    loading: true,
    banner_url:'',
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
        debugger;
        if(!response && response.data.length > 0){
          yield put({
            type: 'save',
            payload: response.data,
          });
        }
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
      * checkEdit({payload,callback},{call,put}){
        //确定编辑，成功以后跳转到列表页
        const response = yield call(queryBanner, payload);
        if(callback){
          callback(response);
        }
        yield put({
          type: 'changeEditData',
          payload:{},
        });
        yield put(routerRedux.push('/operations/banner'))
      },
      * baseImg({payload,callback},{call,put}){
        //base64传给后台 后台返一个 图片url
        const response = yield call(baseImg, payload);
        yield put({
          type: 'changeBaseImg',
          payload:response.data,
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
    changeBaseImg(state, action) {
      return {
        ...state,
        banner_url: action.payload,
      };
    },
  },
};
