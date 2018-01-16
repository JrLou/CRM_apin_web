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
export default class ViewOrder extends PureComponent {
    constructor() {
        super()
    }
    render() {
        return (
            <PageHeaderLayout>
                <AddorderForm isView={true} />
            </PageHeaderLayout >
        )
    }
}