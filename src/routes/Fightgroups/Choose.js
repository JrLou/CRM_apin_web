import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal, Table, Checkbox, message, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { Link, routerRedux } from 'dva/router';
import LogTable from './components/LogTable';
import moment from 'moment';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const period = [
  { label: '上午航班（06:00-12:00）', value: '0' },
  { label: '下午航班（12:00-19:00）', value: '1' },
  { label: '晚上航班（19:00-06:00）', value: '2' },
];
const daysArr = [
  { label: '2天', value: '0' },
  { label: '3天', value: '1' },
  { label: '4天', value: '2' },
  { label: '5天', value: '3' },
  { label: '6天', value: '4' },
  { label: '7天及以上', value: '5' }
]
const allValues = ['0', '1', '2', '3', '4', '5']
@connect(state => ({
  chooseData: state.choose,
}))
@Form.create()
export default class Choose extends PureComponent {
  constructor() {
    super()
    this.page = {
      page: 1,
      pageSize: 10
    }
    this.searchValue = {}
  }
  state = {
    modalVisible: false,
    selectedRowKeys: [],
    selectRows: [],

    checkedList: [],
    indeterminate: false,
    checkAll: false,

    daysCheckedList: [],
    daysIndeterminate: false,
    daysCheckAll: false,

  };
  componentWillMount() {
    const { dispatch } = this.props;
    if (!this.props.location.state) {
      dispatch(routerRedux.push('/fightgroups/demand/'));
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.location.state ? this.props.location.state : {};
    const params = {
      ...this.page,
      id: id
    }
    dispatch({
      type: 'choose/fetch',
      payload: params,
    });
  }


  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const { id } = this.props.location.state ? this.props.location.state : {};
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      id: id,
      ...this.searchValue,
    };
    dispatch({
      type: 'choose/fetch',
      payload: params,
    });
  };

  handleSearch() {
    const { dispatch, form } = this.props;
    const { id } = this.props.location.state ? this.props.location.state : {};

    form.validateFields((err, values) => {
      if (err) return;
      console.log('参数');
      values.flightStartTime = values.flightTime ? moment(values.flightTime[0]).format('YYYY-MM-DD') : '';
      values.flightEndTime = values.flightTime ? moment(values.flightTime[1]).format('YYYY-MM-DD') : '';

      console.log(values);
      this.searchValue = values;
      dispatch({
        type: 'choose/fetch',
        payload: { ...values, id: id },
      });
    });
  }
  resetSearch = () => {
    this.props.form.resetFields();
    // 全选的特殊处理
    this.setState({
      checkedList: [],
      indeterminate: false,
      checkAll: false,

      daysCheckedList: [],
      daysIndeterminate: false,
      daysCheckAll: false,
    }, this.handleSearch)

  }
  pushScheme = () => {
    const { dispatch } = this.props;
    const { id } = this.props.location.state
    if (!this.state.selectedRowKeys.length) {
      message.warning('请先选择需要推送方案的订单')
      return
    }
    this.props.history.push({ pathname: '/fightgroups/demand/push', state: { demandId: id, orderList: this.state.selectRows } });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag
    });
  }

  selectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectRows: selectedRows,
      selectedRowKeys: selectedRowKeys
    })
  }

  peroidChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < period.length),
      checkAll: checkedList.length === period.length,
    });
  }
  onCheckAllChange = (e) => {
    console.log(e.target.checked)
    this.setState({
      checkedList: e.target.checked ? ['0', '1', '2'] : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  daysPeroidChange = (daysCheckedList) => {
    this.setState({
      daysCheckedList,
      daysIndeterminate: !!daysCheckedList.length && (daysCheckedList.length < daysArr.length),
      daysCheckAll: daysCheckedList.length === daysArr.length,
    });
  }
  daysOnCheckAllChange = (e) => {
    console.log(e.target.checked)
    this.setState({
      daysCheckedList: e.target.checked ? allValues : [],
      daysIndeterminate: false,
      daysCheckAll: e.target.checked,
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form>
        <Row gutter={20}>
          <Col span={8}>
            <FormItem label="起飞时间" {...formItemLayout}>
              {getFieldDecorator('flightTime')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="订单号" {...formItemLayout}>
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem >
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            不限
          </Checkbox>
          {getFieldDecorator('dayPeriod', {
            initialValue: this.state.checkedList,
            valuePropName: 'checked',
          })(
            <CheckboxGroup options={period} onChange={this.peroidChange} value={this.state.checkedList} className={styles.inlineGroup} />
            )}
        </FormItem>
        <FormItem label="出行天数">
          <Checkbox
            indeterminate={this.state.daysIndeterminate}
            onChange={this.daysOnCheckAllChange}
            checked={this.state.daysCheckAll}
          >
            全选
          </Checkbox>
          {getFieldDecorator('days', {
            initialValue: this.state.daysCheckedList,
            valuePropName: 'checked',
          })(
            <CheckboxGroup options={daysArr} onChange={this.daysPeroidChange} value={this.state.daysCheckedList} className={styles.inlineGroup} />
            )}
        </FormItem>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }} className={styles.btnBox}>
            <Button type="primary" htmlType="submit" onClick={this.handleSearch.bind(this)}>查询</Button>
            <Button type="default" onClick={this.resetSearch.bind(this)}>重置</Button>
            <Button type="primary" onClick={this.pushScheme.bind(this)}>推送方案</Button>
          </span>
        </div>
      </Form>
    );
  }
  getLogs = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'choose/getLogs',
      payload: id,
    });
    this.handleModalVisible(true)
  }
  render() {
    const { modalVisible, record } = this.state;
    const columns = [
      {
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
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.selectChange.bind(this)
    };
    const { chooseData: { tableData, loading, logData } } = this.props;
    return (
      <PageHeaderLayout>
        <Spin spinning={loading}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {this.renderForm()}
              </div>

              <Table
                // dataSource={list}
                dataSource={tableData && tableData.data}
                columns={columns}
                pagination={{ showSizeChanger: true, showQuickJumper: true, total: tableData.option && tableData.option.total }}
                // loading={loading}
                onChange={this.handleTableChange}
                rowKey="id"
                rowSelection={rowSelection}
              />
            </div>
          </Card>
          <Modal
            title="日志"
            visible={modalVisible}
            onCancel={() => this.handleModalVisible(false)}
            footer={null}
            width={800}
          >
            <LogTable logData={logData}> </LogTable>
          </Modal>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

