//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar } from '../../utils/utils';
import AddorderForm from './components/AddOrderForm';
@connect(state => ({
    offline: state.offline,
}))
export default class ViewOrder extends PureComponent {
    constructor(props) {
        super(props)
        this.par = getPar(this, 'id')
    }
    componentDidMount() {
        const { dispatch } = this.props;
        if (this.par) {
            dispatch({
                type: 'offline/fetchDetail',
                payload: { id: this.par },
            });
        }
    }
    _toMoment = (values, strArr) => {
        strArr.map((v, k) => {
            if (values[v]) {
                values[v] = moment(values[v], 'YYYY-MM-DD');
            }
        })
        return values;
    }
    render() {
        const { offline: { orderDetail } } = this.props;
        let changedDetail = orderDetail;
        changedDetail = changedDetail.order ? changedDetail.order : {};
        changedDetail = this._toMoment(changedDetail, ['arrDate', 'depDate', 'inquiryDate', 'printDate', 'payoffDate', 'receiptDate']);
        changedDetail.records = orderDetail.records;
        return (
            <PageHeaderLayout>
                <AddorderForm isView={true} detail={changedDetail} id={this.par} readOnly={true} />
            </PageHeaderLayout >
        )
    }
}