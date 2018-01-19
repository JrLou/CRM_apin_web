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
import { formatPar } from '../../../utils/utils';
let demandId, orderList;
@connect(state => ({
    data: state.push,
    logTableList: state.choose
}))
@Form.create()
export default class SearchFlight extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false
        }
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
                let startms = moment(this.props.form.getFieldValue('startDate')).format('x');
                let endms = moment(this.props.form.getFieldValue('endDate')).format('x');
                if (startms > endms) {
                    message.warning('出发时间不能大于到达时间')
                    return
                }
                let idString = orderList.map((v, k) => {
                    return v.id
                })
                values.startDate = moment(values.startDate).format('YYYY-MM-DD');
                values.endDate = moment(values.endDate).format('YYYY-MM-DD');
                values.sellPrice = values.sellPrice * 100;
                this.props.dispatch({
                    type: 'push/fetch',
                    payload: { ...values, goAirLine: [depData], backAirLine: [arrData], idString: idString.join(',') },
                });
            }
        });
    }
    searchFlight = (isLeft) => {
        const { getFieldValue } = this.props.form;
        let reg = /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/;
        let date = isLeft ? getFieldValue('startDate') : getFieldValue('endDate');
        let flightNo = isLeft ? getFieldValue('flightNoDep') : getFieldValue('flightNoArr');
        if (!date || !flightNo || !reg.test(flightNo)) {
            message.warning('请输入日期和正确的航班号再查询')
            return
        }
        this.props.dispatch({
            type: 'push/whichCard',
            payload: isLeft,
        });
        this.props.dispatch({
            type: 'push/search',
            payload: { endDate: moment(date).format('YYYY-MM-DD'), startDate: moment(date).format('YYYY-MM-DD'), fnum: flightNo, single: true },
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
        const { data: { flightNo } } = this.props;
        this.props.dispatch({
            type: 'push/goAddFlight',
            payload: flightNo,
        });
    }
    addFlight = (values) => {
        this.props.dispatch({
            type: 'push/setCard',
            payload: [values],
        });
    }
    getLogs = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/getLogs',
            payload: { ...{ p: 1, pc: 9999 }, id },
        });
        this.handleModalVisible(true)
    }
    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag
        });
    }
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
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
        const { data: { depData, arrData, flightsArr, flightsTableShow, showWhat, isLeft, modalTitle, loading, flightNo } } = this.props;
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
                component = <Spin spinning={loading}><AddFlightForm inputFlightNo={flightNo} sumit={this.addFlight} /></Spin>
                break;
            default:
                component = null
                break;
        }
        const columns = [
            {
                title: '订单号',
                dataIndex: 'id',
                render: (text, record) => <Link target="_blank" to={{ pathname: '/order/entrust/detail/' + formatPar({ id: text }) }}>{text}</Link>,
            },

            {
                title: '出发城市',
                dataIndex: 'city_dep',
            },
            {
                title: '到达城市',
                dataIndex: 'city_arr',
            },
            {
                title: '下单时间',
                dataIndex: 'create_time',
                render: (text, record) => {
                    return moment(text).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: '订单状态',
                dataIndex: 'order_status',
                render: (text, record) => {
                    return '委托中';
                }
            },

            {
                title: '订单人数',
                dataIndex: 'adult_count',
            },
            {
                title: '出行天数',
                dataIndex: 'trip_days',
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
                                {getFieldDecorator('startDate', {
                                    rules: [{ required: true, message: '必填' }],
                                })(
                                    <DatePicker disabledDate={this.disabledDate} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem label="返回日期"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('endDate', {
                                    rules: [{ required: true, message: '必填' }],

                                })(
                                    <DatePicker disabledDate={this.disabledDate} />)}
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
                                {getFieldDecorator('sellPrice', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^\+?[1-9]\d{0,5}$/,
                                        message: '请输入6位及以下正整数',
                                    }],

                                })(
                                    <Input style={{ width: '85%' }} placeholder="请输入销售价格" />)
                                }
                                <span style={{ marginLeft: '5px' }}>元/人</span>
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem label="方案有效时间"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('expiredTime', {
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        pattern: /^\+?[1-9]\d{0,2}$/,
                                        message: '请输入1到999之间的整数',
                                    }],
                                })(
                                    <Input style={{ width: '85%' }} placeholder="请输入方案保留时间" />)
                                }
                                <span style={{ marginLeft: '5px' }}>小时</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>
                            <FormItem label="折扣"  {...formItemLayout} className={styles.formItem}>
                                {getFieldDecorator('discount', {
                                    rules: [{ required: true, message: '必填' },
                                    { pattern: /^[12](\.\d{1})?$|^([3])(\.0)?$|^[0](\.[1-9]{1}){1}$/, message: '请输入0到3之间的折扣数，可以是1位小数', }],

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
                    <div className={styles.contentBox}>
                        {flightsTableShow ? component : null}
                    </div>
                </Modal>
                <Modal
                    title="日志"
                    visible={this.state.modalVisible}
                    onCancel={() => this.handleModalVisible(false)}
                    footer={null}
                    width={1000}
                >
                    <div className={styles.contentBox}>
                        <LogTable logData={logData && logData.data} bordered={true}> </LogTable>
                    </div>
                </Modal>
            </div>
        );
    }
}
