import { postGroupData, searchFlights, addFlights } from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {
    namespace: 'push',
    state: {
        loading: false,
        isLeft: true,
        depData: {},
        arrData: {},
        flightsTableShow: false,
        flightsArr: [],
        showWhat: '',
        modalTitle: ''
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(postGroupData, payload);
            if (response.code >= 1) {
                message.success('推送成功，将进入拼团查看页面');

                yield put(routerRedux.push('/DSADA/1213'));
            }
            // 路由跳转
            yield put({
                type: 'reset',
                payload: '',
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        *search({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(searchFlights, payload);
            if (response.code >= 1) {
                message.success('操作成功');
                yield put({
                    type: 'getFlights',
                    payload: { ...response, modalTitle: '航班号为：' + payload.flightNo + '的所有航班' },
                });
            }
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        *addFlight({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(addFlights, payload);
            if (response.code >= 1) {
                message.success('操作成功');
                yield put({
                    type: 'setCard',
                    payload: [payload],
                });

            }
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        }
    },

    reducers: {
        reset(state, action) {
            return {
                ...state,
                depData: {},
                arrData: {},
                flightsTableShow: false,
                flightsArr: [],
                modalTitle: ''
            };
        },

        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        getFlights(state, action) {
            // 判断是不是查到了航班，如果是空数组则跳出手动添加按钮。
            let data = action.payload.data.length < 0 ?
                {
                    ...state,
                    flightsArr: action.payload.data,
                    flightsTableShow: true,
                    showWhat: 'selectFlight',
                    modalTitle: action.payload.modalTitle
                }
                :
                {
                    ...state,
                    flightsArr: action.payload.data,
                    flightsTableShow: true,
                    showWhat: 'toAddFlight',
                    modalTitle: action.payload.modalTitle
                };
            return data;
        },
        whichCard(state, action) {
            return {
                ...state,
                isLeft: action.payload,
            };
        },
        showModal(state, action) {
            return {
                ...state,
                flightsTableShow: action.payload,
            };
        },
        setCard(state, action) {
            let key = state.isLeft ? 'depData' : 'arrData';
            return {
                ...state,
                [key]: action.payload[0],
                showWhat: 'null',
                modalTitle: '',
                flightsTableShow: false,
            };
        },
        goAddFlight(state, action) {
            return {
                ...state,
                showWhat: 'addFlight',
                modalTitle: '手工录入航班'
            };
        },

    },
};