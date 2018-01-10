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

import styles from './UserList.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  userList: state.userList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'userList/fetch'
    });
  }

  // getList(){
  //   const values = this.props.form.getFieldsValue();
  //   for (let item in values) {
  //     if (values[item] === undefined) {
  //       values[item] = '';
  //     }
  //   }
  //   this.setState({
  //     formValues:values,
  //   });
  //   let {page}=this.state;
  //   let params = Object.assign(page, values);
  //   this.props.dispatch({
  //     type: 'userList/fetch',
  //     payload: params,
  //   });
  // }
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
      type: 'userList/fetch',
      payload: params,
    });

  };
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'userList/fetch',
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
        type: 'userList/fetch',
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
        <FormItem label="微信昵称:" style={formItemStyle}>
          {getFieldDecorator('name', {
            initialValue: "",
            rules: [{max: 30, message: '长度不能超过30'}],
          })
          (<Input placeholder="请输入" style={inputStyle}/>)
          }
        </FormItem>
        <FormItem label="手机号:" style={formItemStyle}>
          {getFieldDecorator('mobile', {
            initialValue: "",
            rules: [{
              pattern: /^\d{0,11}$/,
              message: '请输入正确的手机号'
            }],
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
    const {userList: {loading: ruleLoading, data,}} = this.props;
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
