//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar, formatPar } from '../../utils/utils';
import AddorderForm from './components/AddOrderForm';
@connect(state => ({
    offline: state.offline,
}))
export default class AddOrder extends PureComponent {
    constructor() {
        super()
    }
    componentDidMount() {
        // 初始化之后清空保存的方案和退改信息
        const { dispatch } = this.props;
        dispatch({
            type: 'offline/resetPlansAndEndorse',
            payload: '',
        });
    }

    render() {
        return (
            <PageHeaderLayout>
                <AddorderForm />
            </PageHeaderLayout >
        )
    }
}