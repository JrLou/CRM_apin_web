import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col
} from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CustomerMannagement.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    modalFormValues: {},
    visible: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'customerMannagement/fetch'
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {//分页、排序、筛选变化时触发
    console.log("pagination", pagination);
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      p: pagination.current,
      pc: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customerMannagement/fetch',
      payload: params,
    });

  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'customerMannagement/fetch',
      payload: {},
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

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
        type: 'customerMannagement/fetch',
        payload: values,
      });
    });
  };

  handleModalSave = (e) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        modalFormValues: values,
      });
      dispatch({
        type: 'customerMannagement/fetch',
        payload: values,
      });
    });
  };

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const layoutForm = {md: 8, lg: 24, xl: 48};

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="客户名称:">
              {getFieldDecorator('name', { //【客户名称】支持中文、英文、数字，最多50个字符；
                initialValue: "",
                rules: [{max: 50, message: '长度不能超过50'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人:">
              {getFieldDecorator('connect', {//【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: "",
                rules: [{max: 20, message: '长度不能超过20'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号:">
              {getFieldDecorator('mobile', {//【电话号码】支持数字，允许输入特殊字符，最多50个字符；
                initialValue: "",
                rules: [{
                  pattern: /^\d{0,20}$/,
                  message: '请输入正确的手机号'
                }],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator('wechat', {//【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
                initialValue: "",
                rules: [{max: 32, message: '长度不能超过32'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={this.showModal}>新增客户</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <FormItem>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderModalForm() {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    const formTailLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20, offset: 4},
    };

    return (
      <Form onSubmit={this.handleModalSave}>
        <FormItem {...formItemLayout} label="客户名称:">
          {getFieldDecorator('name1', { //【客户名称】支持中文、英文、数字，最多50个字符；
            initialValue: "",
            rules: [{max: 50, message: '长度不能超过50'}],
          })
          (<Input placeholder="请输入"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="联系人:">
          {getFieldDecorator('connect1', {//【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
            initialValue: "",
            rules: [{max: 20, message: '长度不能超过20'}],
          })
          (<Input placeholder="请输入"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="手机号:">
          {getFieldDecorator('mobile1', {//【电话号码】支持数字，允许输入特殊字符，最多50个字符；
            initialValue: "",
            rules: [{
              pattern: /^\d{0,20}$/,
              message: '请输入正确的手机号'
            }],
          })
          (<Input placeholder="请输入"/>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="微信/QQ:">
          {getFieldDecorator('wechat1', {//【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
            initialValue: "",
            rules: [{max: 32, message: '长度不能超过32'}],
          })
          (<Input placeholder="请输入"/>)
          }
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            确认
          </Button>
          <Button
            style={{marginLeft: 8}}
            onClick={() => {
              this.setState({visible: false});
            }}
          >
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const {customerMannagement: {loading: ruleLoading, data,}} = this.props;
    const {selectedRows} = this.state;
    // const breadcrumbList = [{
    //   title: '一级菜单',
    //   href: '/',
    // }, {
    //   title: '二级菜单',
    //   href: '/',
    // }, {
    //   title: '三级菜单',
    // }];
    return (
      <PageHeaderLayout
        // breadcrumbList={breadcrumbList}
      >
        <Card
          bordered={false}
          style={{minWidth: '780px'}}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <p>共搜索到{data.option.total}条数据</p>
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
          title="新增客户"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // footer={null}
        >
          {this.renderModalForm()}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
