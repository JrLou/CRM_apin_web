import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  message
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

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const formItemStyle = {
      width: "350px",
      display: "inline-block"
    };
    const inputStyle = {
      width: "220px",
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="客户名称:" style={formItemStyle}>
          {getFieldDecorator('name', { //【客户名称】支持中文、英文、数字，最多50个字符；
            initialValue: "",
            rules: [{max: 50, message: '长度不能超过50'}],
          })
          (<Input placeholder="请输入" style={inputStyle}/>)
          }
        </FormItem>
        <FormItem label="联系人:" style={formItemStyle}>
          {getFieldDecorator('connect', {//【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
            initialValue: "",
            rules: [{max: 20, message: '长度不能超过20'}],
          })
          (<Input placeholder="请输入" style={inputStyle}/>)
          }
        </FormItem>
        <FormItem label="手机号:" style={formItemStyle}>
          {getFieldDecorator('mobile', {//【电话号码】支持数字，允许输入特殊字符，最多50个字符；
            initialValue: "",
            rules: [{
              pattern: /^\d{0,20}$/,
              message: '请输入正确的手机号'
            }],
          })
          (<Input placeholder="请输入" style={inputStyle}/>)
          }
        </FormItem>
        <FormItem label="微信/QQ:" style={formItemStyle}>
          {getFieldDecorator('wechat', {//【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
            initialValue: "",
            rules: [{max: 32, message: '长度不能超过32'}],
          })
          (<Input placeholder="请输入" style={inputStyle}/>)
          }
        </FormItem>
        <FormItem style={formItemStyle}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
        </FormItem>
      </Form>
    );
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
      </PageHeaderLayout>
    );
  }
}
