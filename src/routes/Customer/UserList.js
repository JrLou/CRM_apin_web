import React, { PureComponent } from "react";
import { connect } from "dva";
import { Card, Form, Input, Button, Row, Col } from "antd";
import StandardTable from "./TableList";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";

import styles from "./UserList.less";

const FormItem = Form.Item;
@connect(state => ({
  userList: state.userList,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: {},
    };
    this.page = {
      p: 1,
      pc: 10,
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleStandardTableChange = pagination => {
    //分页、排序、筛选变化时触发
    this.page = {
      p: pagination.current,
      pc: pagination.pageSize,
    };
    this.loadListData();
  };

  //当【查询】or 【重置】时，都应该从第一页从新请求
  resetCurrentPage = () => {
    this.page = {
      ...this.page,
      p: 1,
    };
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFields((err, formValues) => {
      if (err) {
        return;
      }
      this.setState({ formValues }, this.handleSearch);
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      this.setState({ formValues }, () => {
        this.resetCurrentPage();
        this.loadListData();
      });
    });
  };

  loadListData = () => {
    if (this.props.userList.double) {
      return;
    }
    const { dispatch } = this.props;
    const payload = { ...this.state.formValues, ...this.page };
    dispatch({
      type: "userList/fetch",
      payload,
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemStyle = {
      // width: "350px",
      // display: "inline-block"
    };
    const inputStyle = {
      // width: "220px",
    };

    const layoutForm = { md: 8, lg: 24, xl: 48 };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="微信昵称:" style={formItemStyle}>
              {getFieldDecorator("name", {
                initialValue: "",
                rules: [{ max: 32, message: "最长32位" }],
              })(<Input placeholder="请输入" style={inputStyle} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号:" style={formItemStyle}>
              {getFieldDecorator("mobile", {
                initialValue: "",
                rules: [{ max: 32, message: "最长32位" }],
              })(<Input placeholder="请输入" style={inputStyle} />)}
            </FormItem>
          </Col>
          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <FormItem style={formItemStyle}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </FormItem>
          </div>
        </Row>
      </Form>
    );
  }

  render() {
    const { userList: { loading: ruleLoading, data } } = this.props;
    const { selectedRows } = this.state;
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
        <Card bordered={false} style={{ minWidth: "780px" }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
