import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Row, Col, Input, message, Modal, Spin, Table } from 'antd';
import styles from './SearchFlight.less';
import { Link, routerRedux } from 'dva/router';
const FormItem = Form.Item;
import FlightCard from './FlightCard';
import LogTable from './LogTable';
import moment from 'moment';
import SearchFlightTable from './SearchFlightTable';
import AddFlightForm from './AddFlightForm';
let demandId, orderList;
@connect(state => ({
    data: state.push,
    logTableList: state.choose
}))
@Form.create()
export default class SearchFlight extends PureComponent {
    state = {
        modalVisible: false
    }
    componentWillMount() {
        const { dispatch } = this.props;
        if (!this.props.location.state) {
            dispatch(routerRedux.push('/fightgroups/demand/'));
        } else {
            demandId = this.props.location.state.demandId;
            orderList = this.props.location.state.orderList;
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { data: { depData, arrData } } = this.props;
                // 正式环境判断depData和arrData是不是空对象
                const showDepCard = JSON.stringify(depData) == "{}";
                const showArrCard = JSON.stringify(arrData) == "{}";
                if (showDepCard || showArrCard) {
                    message.warning('请选择出发航班和返回航班后再提交')
                    return
                }
                this.props.dispatch({
                    type: 'push/fetch',
                    payload: { ...values, depData, arrData, id: this.props.location.state.demandId },
                });
            }
        });
    }
    searchFlight = (isLeft) => {
        const { getFieldValue } = this.props.form;
        let date = isLeft ? getFieldValue('beginDate') : getFieldValue('endDate');
        let flightNo = isLeft ? getFieldValue('flightNoDep') : getFieldValue('flightNoArr');
        if (!date || !flightNo) {
            message.warning('请输入日期和航班号再查询')
            return
        }
        this.props.dispatch({
            type: 'push/whichCard',
            payload: isLeft,
        });
        this.props.dispatch({
            type: 'push/search',
            payload: { date: moment(date).format('YYYY-MM-DD'), flightNo: flightNo },
        });

    }
    getFlight = (obj) => {
        this.props.dispatch({
            type: 'push/setCard',
            payload: obj,
        });
    }
    showModal = (bool) => {
        this.props.dispatch({
            type: 'push/showModal',
            payload: bool,
        });
    }
    goAddFlight = () => {
        this.props.dispatch({
            type: 'push/goAddFlight',
            payload: '',
        });
    }
    addFlight = (values) => {
        this.props.dispatch({
            type: 'push/addFlight',
            payload: values,
        });
    }
    getLogs = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/getLogs',
            payload: id,
        });
        this.handleModalVisible(true)
    }
    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag
        });
    }
    render() {
        // const { data: { list, loading } } = this.props; 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { data: { depData, arrData, flightsArr, flightsTableShow, showWhat, isLeft, modalTitle, loading } } = this.props;
        const { logData } = this.props.logTableList ? this.props.logTableList : {};
        const showDepCard = JSON.stringify(depData) !== "{}";
        const showArrCard = JSON.stringify(arrData) !== "{}";
        let component;
        switch (showWhat) {
            case 'selectFlight':
                component = <SearchFlightTable tableData={flightsArr} getFlight={this.getFlight}></SearchFlightTable>
                break;
            case 'toAddFlight':
                component = <div>
                    <div className={styles.noFlight}>没有该航班信息</div>
                    <div className={styles.noFlight}> <Button type="primary" onClick={this.goAddFlight}>手工录入</Button></div>
                </div>
                break;
            case 'addFlight':
                component = <Spin spinning={loading}><AddFlightForm sumit={this.addFlight} /></Spin>
                break;
            default:
                component = null
                break;
        }
        const columns = [{
            title: '订单号',
            dataIndex: 'id',
            render: (text, record) => <Link to={'/fightgroups/demand/checkFightGroups'}>{text}</Link>,
        },

        {
            title: '出发城市',
            dataIndex: 'depAirport',
        },
        {
            title: '到达城市',
            dataIndex: 'arrAirport',
        },
        {
            title: '下单时间',
            dataIndex: 'createTime',
        },
        {
            title: '起飞时间',
            dataIndex: 'createTimePeriod',
        },
        {
            title: '订单状态',
            dataIndex: 'status',
        },
        {
            title: '是否接受微调',
            dataIndex: 'isAllowChange',
        },
        {
            title: '订单人数',
            dataIndex: 'orderCount',
        },
        {
            title: '出行天数',
            dataIndex: 'days',
        },
        {
            title: '推送记录',
            render: (text, record) => <a href="javascript:;" onClick={this.getLogs.bind(this, record.id)}>推送日志</a>,
        }];
        return (
            <div style={{ 'minWidth': '900px' }}>
                <Form className='searchForm' onSubmit={this.handleSubmit} >
                    <Row>
                        <Col span={9}>
                            <FormItem label="起飞日期"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('beginDate', {
                                    rules: [{ required: true, message: '必填' }],
                                })(
                                    <DatePicker />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem label="返回日期"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('endDate', {
                                    rules: [{ required: true, message: '必填' }],

                                })(
                                    <DatePicker />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>
                            <FormItem label="出发航班"  {...formItemLayout} className={styles.formItem + ' notFull'}>
                                {getFieldDecorator('flightNoDep', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                                        message: '请输入正确的航班号',
                                    }],

                                })(
                                    <Input placeholder="请输入航班" />)
                                }
                                <Button type="primary" onClick={this.searchFlight.bind(null, true)} className={styles.btn}>查询</Button>
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem label="到达航班"  {...formItemLayout} className={styles.formItem + ' notFull'}>
                                {getFieldDecorator('flightNoArr', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                                        message: '请输入正确的航班号',
                                    }],
                                })(
                                    <Input placeholder="请输入航班" />)
                                }
                                <Button type="primary" onClick={this.searchFlight.bind(null, false)} className={styles.btn}>查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    {showDepCard || showArrCard ?
                        <Row>
                            <Col span={9}>
                                <div style={{ width: '75%', float: 'right', marginBottom: '15px' }} >
                                    <FlightCard visiable={showDepCard} cardData={depData}></FlightCard>
                                </div>
                            </Col>
                            <Col span={9}>
                                <div style={{ width: '75%', float: 'right', marginBottom: '15px' }} >
                                    <FlightCard visiable={showArrCard} cardData={arrData}></FlightCard>
                                </div>
                            </Col>
                        </Row>
                        :
                        null
                    }
                    <Row>
                        <Col span={9}>
                            <FormItem label="销售价格"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^\+?[1-9]\d{0,5}$/,
                                        message: '请输入6位及以下正整数',
                                    }],

                                })(
                                    <Input placeholder="请输入销售价格" />)
                                }

                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem label="方案有效时间"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('validDate', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^\+?[1-9]\d{0,2}$/,
                                        message: '最大不能超过999小时',
                                    }],
                                })(
                                    <Input placeholder="请输入方案保留时间" />)
                                }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>
                            <FormItem label="折扣"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('discount', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^[1-3]$/,
                                        message: '请输入折扣，不可高于3折',
                                    }],

                                })(
                                    <Input placeholder="请输入折扣，不可高于3折" />)
                                }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <FormItem style={{ marginTop: 32, textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit">  确认推送  </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div className={styles.orderBox}>
                    <h3>推送订单</h3>
                    <Table
                        dataSource={orderList}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        bordered={true}
                    />
                </div>
                <Modal
                    title={modalTitle}
                    visible={flightsTableShow}
                    footer={null}
                    width={600}
                    onCancel={this.showModal.bind(null, false)}
                >
                    {flightsTableShow ? component : null}
                </Modal>
                <Modal
                    title="日志"
                    visible={this.state.modalVisible}
                    onCancel={() => this.handleModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    <LogTable logData={logData} bordered={true}> </LogTable>
                </Modal>
            </div>
        );
    }
}
