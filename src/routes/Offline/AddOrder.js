//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker, Tabs } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar, formatPar } from '../../utils/utils';
import AddorderForm from './components/AddOrderForm'
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(state => ({
    offline: state.offline,
}))
@Form.create()
export default class AddOrder extends PureComponent {
    constructor() {
        super()
    }
    handleSearch() {
        const { dispatch, form } = this.props;

        form.validateFields((err, values) => {
            if (err) return;
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        return (
            <PageHeaderLayout>
                <AddorderForm />
            </PageHeaderLayout >
        )
    }
}