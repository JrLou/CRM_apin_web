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
import {AddModal} from './ModalCpm'

import styles from './CustomerMannagement.less';

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
      p: 1,
      pc: 10,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'customerMannagement/fetch',
      payload: this.page,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {//分页、排序、筛选变化时触发
    console.log("pagination", pagination);
    const {dispatch} = this.props;

    this.page = {
      p: pagination.current,
      pc: pagination.pageSize,
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
      p: 1,
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
            <Button type="primary" onClick={this.handleshowModal.bind(this)}>新增客户</Button>
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

  handleCancel(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: {showModal: false},//传过去的参数
    });
    //关闭的时候，清除modalData以防报错
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: {
        modalData: {
          code: '',
          data: [],
          msg: '',
        }
      }
    });
  }

  handleOk(e) {
    if (!this.state.closeReason.trim()) {
      message.warning("请输入关闭拼团原因");
      return;
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/fetchPlanClose',
      payload: {//传过去的参数
        reason: this.state.closeReason,
        id: this.id,
      },
    });
  }


  getAddModal(showModal, modalConfirmLoading) {
    return (
      <AddModal
        title="请确认是否关闭拼团，关闭请输入原因："
        visible={showModal}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        confirmLoading={modalConfirmLoading}
        maskClosable={false}
      >
        {this.renderModalForm()}
      </AddModal>
    );
  }

  switchModalView() {
    const {showModal, modalConfirmLoading} = this.props.customerMannagement;
    let ModalView = null;
    switch (this.state.modalType) {
      case 'add':
        ModalView = this.getAddModal(showModal, modalConfirmLoading);
        break;
      case 'edit':
        ModalView = this.getEditModal(showModal, modalConfirmLoading);
        break;
      case 'delete':
        ModalView = this.getDeleteModal(showModal, modalConfirmLoading);
        break;
      default:
        ModalView = null;
        break;
    }
    return ModalView;
  }

  handleshowModal() {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',//modalConfirmLoading
      payload: {showModal: true},//传过去的参数
    });
  }

  render() {
    const {customerMannagement: {loading: ruleLoading, data,}, showModal} = this.props;
    console.log("父级这里的data", data);
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
            <p>共搜索到{data.option.total}条数据</p>
            <StandardTable
              loading={ruleLoading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="新增客户"
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          {this.renderModalForm()}
        </Modal>
        {this.switchModalView()}
      </PageHeaderLayout>
    );
  }
}

// class OperationModal extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//     }
//   }
//
//   render() {
//     let title = '';
//     switch (props.type) {
//       case 'add':
//         title = '新增客户';
//         break;
//       case 'edit':
//         title = '修改客户';
//         break;
//       case 'delete':
//         title = '修改客户';
//         break;
//
//     }
//
//     return <Modal
//       title={title}
//       visible={props.visible}
//       onOk={props.handleOk}
//       onCancel={props.handleCancel}
//     >
//       {this.renderModalForm()}
//     </Modal>
//   }
// };


