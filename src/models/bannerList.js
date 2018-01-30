import { queryBanner, deleteBanner, changeStatus, baseImg, addBannerImg, editBannerImg } from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'bannerList',

  state: {
    data: {
      data: [],
      option: {}
    },
    editData: {},
    loading: false,
    banner_url: '',
    uploadSuccess: false,
  },

  effects:
    {
      * fetch({ payload }, { call, put }) {
        //列表页，请求数据
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryBanner, payload);
        if (response && response.code >= 1) {
          yield put({
            type: 'save',
            payload: response,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      },
      * delete({ payload, callback }, { call, put }) {
        //列表页，删除一个banner
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(deleteBanner, payload);
        if (callback) {
          callback(response);
        }
        // yield put({
        //   type: 'save',
        //   payload: response.data,
        // });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        yield put(routerRedux.push('/operations/banner'))
      },
      * changeStatus({ payload, callback }, { call, put }) {
        //列表页，改变上架下架状态
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(changeStatus, payload);
        if (callback) {
          callback(response);
        }
        // yield put({
        //   type: 'save',
        //   payload: response.data,
        // });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        yield put(routerRedux.push('/operations/banner'))
      },
      * toAdd({ payload }, { call, put }) {
        // 列表页，跳转到新增banner页面
        yield put({
          type: 'changeEditData',
          payload: payload,
        });
        yield put(routerRedux.push('/operations/banner/bannerAdd'))
      },
      * toEdit({ payload }, { call, put }) {
        //列表页，跳转到编辑banner页面
        yield put({
          type: 'changeEditData',
          payload: payload,
        });
        yield put(routerRedux.push('/operations/banner/bannerEdit'))
      },
      * cancelEdit({ payload }, { call, put }) {
        //取消编辑，跳转到列表页
        yield put({
          type: 'changeEditData',
          payload: {},
        });
        yield put({
          type: 'changeBaseImg',
          payload: '',
        });
        yield put(routerRedux.push('/operations/banner'))
      },
      * checkEdit({ payload, callback }, { call, put }) {
        //确定编辑，成功以后跳转到列表页
        const res = yield call(editBannerImg, payload);
        // if (callback) {
        //   callback(response);
        // }
        if(res&&res.code>=1){
          yield put({
            type: 'changeEditData',
            payload: {},
          });

          yield put(routerRedux.push('/operations/banner'))
          message.success('banner编辑成功')
        }
      },
      * addBanner({ payload, callback }, { call, put }) {
        //确定编辑，成功以后跳转到列表页
        const response = yield call(addBannerImg, payload);
        if (response && response.code >= 1) {
          yield put({
            type: 'changeEditData',
            payload: {},
          });
          // 上传成功清除url
          yield put({
            type: 'changeBaseImg',
            payload: ''
          });
          message.success('添加成功')
          yield put(routerRedux.push('/operations/banner'))
        }
      },
      * baseImg({ payload, callback }, { call, put }) {
        //上传banner
        yield put({
          type: 'changeFlag',
          payload: false,
        });
        yield put({
          type: 'changeBaseImg',
          payload: ''
        });
        //base64传给后台 后台返一个 图片url
        const response = yield call(baseImg, payload);
        if (response.code == 1) {
          yield put({
            type: 'changeBaseImg',
            payload: response.data,
          });
          yield put({
            type: 'changeFlag',
            payload: true,
          });
        } else {
          message.error(response.msg);
        }
      }
    },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeEditData(state, action) {
      return {
        ...state,
        editData: action.payload,
        banner_url:action.payload.banner_url,
        uploadSuccess:true,
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
    changeFlag(state, action) {
      return {
        ...state,
        uploadSuccess: action.payload,
      };
    }
  },
};
