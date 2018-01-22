//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar } from '../../utils/utils';
import AddorderForm from './components/AddOrderForm';
import CookieHelp from '../../utils/cookies';
import { Base64 } from 'js-base64'
@connect(state => ({
    offline: state.offline,
}))
export default class EditOrder extends PureComponent {
    constructor(props) {
        super(props)
        this.par = getPar(this, 'id')
        this.currentUser = CookieHelp.getCookieInfo('_r') ? Base64.decode(CookieHelp.getCookieInfo('_r')) : null;
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
        changedDetail = this._toMoment(changedDetail, ['arrDate', 'depDate', 'inquiryDate', 'printDate']);
        // 客服总监
        let isLeader = this.currentUser.split(',').indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;
        // console.log('总监？', isLeader);
        // 未出票都能编辑，出票后总监可以编辑，普通客服如果快递什么的有值了不能编辑 否则可以编辑那个地方。。。
        let flag;
        if (changedDetail.isPrint == 0) {
            flag = false
        } else if (changedDetail.isPrint == 1) {
            flag = isLeader ? false : true;
        }
        console.log('可编辑否？', flag);
        return (
            <PageHeaderLayout>
                <AddorderForm isEdit={true} isLeader={isLeader} detail={changedDetail} id={this.par} readOnly={flag} />
            </PageHeaderLayout >
        )
    }
}