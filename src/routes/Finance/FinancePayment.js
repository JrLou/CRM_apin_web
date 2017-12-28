import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker,
  message
} from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './FinancePayment.less';

const FormItem = Form.Item;
const {Option} = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  financePaymentList: state.financePaymentList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    page:{
      pageNo:1,
      pageSize:10
    }
  };

  componentDidMount() {
    this.getList();
  }
  getList(){
    const values = this.props.form.getFieldsValue();
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = '';
      }
    }
    this.setState({
      formValues:values,
    });
    let {page}=this.state;
    let params = Object.assign(page, values);
    this.props.dispatch({
      type: 'financePaymentList/fetch',
      payload: params,
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'financePaymentList/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'financePaymentList/fetch',
      payload: {},
    });
  };
  // handleMenuClick = (e) => {
  //   const {dispatch} = this.props;
  //   const {selectedRows} = this.state;
  //   if (!selectedRows) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'rule/remove',
  //         payload: {
  //           no: selectedRows.map(row => row.no).join(','),
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: [],
  //           });
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'financePaymentList/fetch',
        payload: values,
      });
    });
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="上传凭证时间">
              {getFieldDecorator('enddate_startdate', { initialValue: "" })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付单号:">
              {getFieldDecorator('recordId', { initialValue: "", rules: [{ max: 30, message: '长度不能超过30' }], })
              (<Input placeholder="请输入…" />)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号:">
              {getFieldDecorator('orderNo', { initialValue: "", rules: [{ max: 30, message: '长度不能超过30' }], })
              (<Input placeholder="请输入…" />)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('status', { initialValue: "" })(
                <Select placeholder="支付状态">
                  <Option value="">全部</Option>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    console.log("props_______________",this.props);
    const {financePaymentList: {loading: ruleLoading, data}} = this.props;
    const {selectedRows, modalVisible, addInputValue} = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="新建规则"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 15}}
            label="描述"
          >
            <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue}/>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
