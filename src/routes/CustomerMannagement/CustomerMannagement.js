import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Input, Button, Row, Col, Select } from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import Detail from './Detail';
import AllModal from './ModalCpm';
import styles from './CustomerMannagement.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      modalType: 'add', //add、 edit、 delete
      currentPage: { action: 'mainPage', payload: {} },
    };
    this.page = {
      pageNum: 1,
      pageSize: 10,
    };
    this.handleFormReset = this.handleFormReset.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: { pageType: 'c' },
    });
    dispatch({
      type: 'customerMannagement/fetch',
      payload: this.page,
    });
  }

  componentWillUnmount() {
    //还原redux中的数据
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/clear',
    });
  }

  getMainPage = () => {
    const { customerMannagement: { loading, data } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false} style={{ minWidth: '780px' }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <p>共搜索到{data.option}条数据</p>
            <StandardTable
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
              handleShowModalSwitch={this.handleShowModalSwitch}
              page={this.page}
              toggleCurrPage={this.toggleCurrPage}
            />
          </div>
        </Card>

        {/* FIXME:仅仅是给【删除】用 后期可以重构，使用ConfirmModal*/}
        <AllModal
          modalType={this.state.modalType}
          page={this.page}
          resetCurrentPage={this.resetCurrentPage}
          handlePageFormReset={this.handleFormReset}
          formValues={this.state.formValues}
        />
      </PageHeaderLayout>
    );
  };

  getPage = ({ action, payload }) => {
    switch (action) {
      case 'mainPage':
        return this.getMainPage();
      case 'addPage':
        return <AddCustomer toggleCurrPage={this.toggleCurrPage} />;
      case 'editPage':
        return (
          <EditCustomer toggleCurrPage={this.toggleCurrPage} id={payload.id} />
        );
      case 'detailPage':
        return <Detail toggleCurrPage={this.toggleCurrPage} data={payload} />;
      default:
        break;
    }
  };

  toggleCurrPage = ({ action, payload }) => {
    this.setState({ currentPage: { action, payload } });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    //分页、排序、筛选变化时触发
    const { dispatch } = this.props;

    Object.assign(this.page, {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });

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
    Object.assign(this.page, { pageNum: 1 });
  };

  async handleFormReset() {
    const { form, dispatch } = this.props;

    await form.resetFields();

    dispatch({
      //每次保存的时候都缓存formData,这次清空
      type: 'customerMannagement/fetchClearCacheSearchFormData',
      succCB: () => {
        this.isReset = true;
        this.handleSearch();
      },
    });
  }

  handleSearch = e => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;

    form.validateFields((err, formValues) => {
      if (err) return;
      this.setState({ formValues }, () => {
        this.resetCurrentPage();
        dispatch({
          type: 'customerMannagement/fetch',
          payload: {
            ...this.page,
            ...this.state.formValues,
          },
        });
        if (!this.isReset) {
          this.isReset = false;
          dispatch({
            //每次保存的时候都缓存formData
            type: 'customerMannagement/saveCacheSearchFormData',
            payload: formValues,
          });
        }
      });
    });
  };

  handleShowModalSwitch = modalType => {
    const { dispatch } = this.props;
    this.setState({ modalType }, () => {
      dispatch({
        type: 'customerMannagement/extendAll', //modalConfirmLoading
        payload: { showModal: true }, //传过去的参数
      });
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      customerMannagement: { pageType, cacheSearchFormData },
    } = this.props;
    const layoutForm = { md: 8, lg: 24, xl: 48 };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('name', {
                //【客户名称】支持中文、英文、数字，最多50个字符；
                initialValue: cacheSearchFormData.name,
                rules: [{ max: 50, message: '最长50位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户类型">
              {getFieldDecorator('type', {
                initialValue: cacheSearchFormData.type,
              })(
                //1-沉积客户、2-激活客户、3-活跃客户',
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  <Option value={1}>沉积客户</Option>
                  <Option value={2}>激活客户</Option>
                  <Option value={3}>活跃客户</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="负责人:">
              {getFieldDecorator('charge', {
                //【负责人】支持模糊搜索，最长字符可输入10个。
                initialValue: cacheSearchFormData.charge,
                rules: [{ max: 10, message: '最长10位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="主要联系人:">
              {getFieldDecorator('contacts', {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: cacheSearchFormData.contacts,
                rules: [{ max: 20, message: '最长20位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话号码:">
              {getFieldDecorator('mobile', {
                //【电话号码】支持数字，允许输入特殊字符，最多50个字符；
                initialValue: cacheSearchFormData.mobile,
                rules: [{ max: 50, message: '最长50位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator('wxqq', {
                //【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
                initialValue: cacheSearchFormData.wxqq,
                rules: [{ max: 100, message: '最长100位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {pageType === 'c' ? null : (
            <Col md={8} sm={24}>
              <FormItem label="优势线路:">
                {getFieldDecorator('predominantLine', {
                  //【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
                  initialValue: '',
                  rules: [{ max: 200, message: '最长200位' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          )}
        </Row>
        <Row>
          <Col span={12}>
            {/* <Link to="/offline/customerMannagement/add"> */}
            {/* TODO: router 中的页面都没有删除 */}
            <Button
              type="primary"
              onClick={() => {
                this.toggleCurrPage({ action: 'addPage' });
              }}
            >
              新增客户
            </Button>
            {/* </Link> */}
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return this.getPage(this.state.currentPage);
  }
}
