import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col
} from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AllModal from './ModalCpm';

import styles from './Template.less';

const FormItem = Form.Item;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      modalFormValues: {},
      visible: false,
      modalType: 'add',//add、 edit、 delete
    };
    this.page = {
      pageNum: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'customerMannagement/fetch',
      payload: this.page,
    });
  }

  componentWillUnmount() {
    //还原redux中modal的数据
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/clear'
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {//分页、排序、筛选变化时触发
    const {dispatch} = this.props;

    this.page = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'customerMannagement/fetch',
      payload: {
        ...this.page,
        ...this.state.formValues,
      },
    });
  };

  //当【查询】or 【重置】时，都应该从第一页从新请求
  resetCurrentPage = () => {
    this.page = {
      ...this.page,
      pageNum: 1,
    }
  };


  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    form.validateFields((err, formValues) => {
      if (err) return;
      this.setState({formValues}, () => {
        this.resetCurrentPage();
        dispatch({
          type: 'customerMannagement/fetch',
          payload: {
            ...this.page,
            ...this.state.formValues
          },
        });
      });
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;

    form.validateFields((err, formValues) => {
      if (err) return;
      this.setState({formValues}, () => {
        this.resetCurrentPage();
        dispatch({
          type: 'customerMannagement/fetch',
          payload: {
            ...this.page,
            ...this.state.formValues
          },
        });
      });

    });
  };

  getPageName = () =>{
    const {customerMannagement:{pageType}} = this.props;
    return pageType === 's' ? '供应商':'客户';
  };

  renderForm() {
    const {form:{getFieldDecorator}} = this.props;
    const layoutForm = {md: 8, lg: 24, xl: 48};

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label={`${this.getPageName()}名称`}>
              {getFieldDecorator('name', { //【客户名称】支持中文、英文、数字，最多50个字符；
                initialValue: "",
                rules: [{max: 50, message: '最长50位'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人:">
              {getFieldDecorator('contacts', {//【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: "",
                rules: [{max: 20, message: '最长20位'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话号码:">
              {getFieldDecorator('mobile', {//【电话号码】支持数字，允许输入特殊字符，最多50个字符；
                initialValue: "",
                rules: [{max: 50, message: '最长50位'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator('wxqq', {//【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
                initialValue: "",
                rules: [{max: 100, message: '最长100位'}],
              })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => this.handleShowModalSwitch('add')}>新增{this.getPageName()}</Button>
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

  handleShowModalSwitch = (modalType) => {
    const {dispatch} = this.props;
    this.setState({modalType}, () => {
      dispatch({
        type: 'customerMannagement/extendAll',//modalConfirmLoading
        payload: {showModal: true},//传过去的参数
      });
    });
  };

  render() {
    const {customerMannagement: {loading, data,}, showModal} = this.props;
    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          style={{minWidth: '780px'}}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <p>共搜索到{data.option}条数据</p>
            <StandardTable
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
              handleShowModalSwitch={this.handleShowModalSwitch}
              page={this.page}
            />
          </div>
        </Card>
        <AllModal
          modalType={this.state.modalType}
          page={this.page}
        />
      </PageHeaderLayout>
    );
  }
}