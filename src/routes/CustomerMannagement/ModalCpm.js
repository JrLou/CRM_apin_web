import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal, Form, Input, Button, Spin} from 'antd';

const FormItem = Form.Item;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
class AddModal extends PureComponent {
  constructor(props) {
    super(props);
  }

  changeModalShow(showModal) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: {showModal}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {dispatch, form, page} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        modalFormValues: values,
      });
      dispatch({
        type: 'customerMannagement/' + this.mapModalTypeToReqAddr(),
        payload: values,
        succCB: () => {
          dispatch({
            type: "customerMannagement/fetch",
            payload: {...page}
          });
          form.resetFields();
        }
      });
    });
  };

  mapModalTypeToReqAddr() {
    const {modalType} = this.props;
    let result = '';
    switch (modalType) {
      case 'add':
        result = "fetchAdd";
        break;
      case 'edit':
        result = "fetchEdit";
        break;
      case 'delete':
        result = "fetchDelete";
        break;
      default :
        result = 'fetchAdd';
        break;
    }
    return result;
  }

  handleOk(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/fetchPlanClose',
      payload: {//传过去的参数
        reason: this.state.closeReason,
        id: this.id,
      },
    });
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

  renderModalForm() {
    const {form: {getFieldDecorator}, dispatch, customerMannagement: {modalFormLoading, modalConfirmLoading}} = this.props;

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    const formTailLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20, offset: 4},
    };

    return (
      <Spin spinning={modalFormLoading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="客户名称:">
            {getFieldDecorator('name', { //【客户名称】支持中文、英文、数字，最多50个字符；
              initialValue: "",
              rules: [{max: 50, message: '长度不能超过50'}],
            })
            (<Input placeholder="请输入"/>)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="地址:">
            {getFieldDecorator('address', { //【客户名称】支持中文、英文、数字，最多50个字符；
              initialValue: "",
              rules: [{max: 100, message: '最长100位'}],
            })
            (<Input placeholder="请输入"/>)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="联系人:">
            {getFieldDecorator('contacts', {//【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
              initialValue: "",
              rules: [{max: 20, message: '长度不能超过20'}],
            })
            (<Input placeholder="请输入"/>)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="电话号码:">
            {getFieldDecorator('mobile', {//【电话号码】支持数字，允许输入特殊字符，最多50个字符；
              initialValue: "",
              rules: [{max: 50, message: '最长50位'}],
            })
            (<Input placeholder="请输入"/>)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="微信/QQ:">
            {getFieldDecorator('wxqq', {//【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
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
              loading={modalConfirmLoading}
            >
              确认
            </Button>
            <Button
              style={{marginLeft: 8}}
              onClick={() => {
                this.changeModalShow(false);
              }}
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </Spin>

    );
  }

  render() {
    const {showModal, modalConfirmLoading} = this.props.customerMannagement;
    return (
      <Modal
        title="请确认是否关闭拼团，关闭请输入原因："
        visible={showModal}
        onCancel={() => this.changeModalShow(false)}
        maskClosable={false}
        footer={null}
      >
        {this.renderModalForm()}
      </Modal>
    );
  }
}

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class DeleteModal extends PureComponent {
  constructor(props) {
    super(props);
  }

  changeModalShow(showModal) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: {showModal}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/fetchDelete',
      payload: values,
    });
  };

  handleOk(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/fetchPlanClose',
      payload: {//传过去的参数
        reason: this.state.closeReason,
        id: this.id,
      },
    });
  }

  handleCancel(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: {showModal: false},//传过去的参数
    });
  }

  render() {
    const {showModal, modalConfirmLoading} = this.props.customerMannagement;
    return (
      <Modal
        title={null}
        visible={showModal}
        onOk={this.handleOk.bind(this)}
        onCancel={() => this.changeModalShow(false)}
        confirmLoading={modalConfirmLoading}
        maskClosable={false}
        footer={null}
        width={400}
      >
        <div style={{textAlign: 'center', lineHeight: '3.5em'}}>
          <h3>是否确认删除</h3>
          <Button style={{marginRight: 8}} type="primary">确认</Button>
          <Button
            style={{marginLeft: 8}}
            onClick={() => this.changeModalShow(false)}
          >
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

const AllModal = (props) => {
  const ModalView = props.modalType === 'delete' ? DeleteModal : AddModal;
  return (
    <ModalView
      {...props}

    />
  );
};

export default AllModal;
