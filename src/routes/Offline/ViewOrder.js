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

    render() {
        const { offline: { orderDetail } } = this.props;
        return (
            <PageHeaderLayout>
                <AddorderForm isView={true} detail={orderDetail} id={this.par} readOnly={true} />
            </PageHeaderLayout >
        )
    }
}