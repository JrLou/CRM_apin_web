import React, { PureComponent } from "react";
import { connect } from "dva";
import { Modal, Form, Input, Button, Spin, message } from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
class AddEditModal extends PureComponent {
  getPageName = () => {
    const { customerMannagement: { pageType } } = this.props;
    return pageType === "s" ? "供应商" : "客户";
  };

  getInitData = (data, key) => {
    if (!data) return;
    return data[key] || "";
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      dispatch,
      form,
      handlePageFormReset,
      modalType,
      customerMannagement: { modalData: { data: modalData } },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.mobile && !fieldsValue.wxqq) { message.warning('微信/QQ、电话号码请至少填一个'); return; }
      const values = {
        ...fieldsValue,
      };

      let urlLast = "";
      let payload = {};
      switch (modalType) {
        case "add":
          urlLast = "fetchAdd";
          payload = { ...values };
          break;
        case "edit":
          urlLast = "fetchEdit";
          payload = { ...values, id: modalData.id };
          break;
        default:
          break;
      }

      dispatch({
        type: `customerMannagement/${urlLast}`,
        payload,
        succCB: () => {
          if (handlePageFormReset) {
            handlePageFormReset(); //执行父页面的【重置】功能
          }
          this.handleCancel(); //清空页面上部的form的内容
        },
      });
    });
  };

  handleCancel(e) {
    const { dispatch, form } = this.props;
    dispatch({
      type: "customerMannagement/extendAll",
      payload: { showModal: false }, //传过去的参数
    });
    //关闭的时候，清除modalData以防报错
    form.resetFields();
    dispatch({
      type: "customerMannagement/extendAll",
      payload: {
        modalData: {
          data: {},
          message: "",
        },
      },
    });
  }

  renderModalForm() {
    const {
      form: { getFieldDecorator },
      customerMannagement: {
        pageType,
        modalFormLoading,
        modalConfirmLoading,
        modalData: { data: modalData },
      },
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const formTailLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17, offset: 5 },
    };

    return (
      <Spin spinning={modalFormLoading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={`${this.getPageName()}名称`}>
            {getFieldDecorator("name", {
              //【客户名称】支持中文、英文、数字，最多50个字符；
              initialValue: this.getInitData(modalData, "name"),
              rules: [
                { max: 50, message: "最长50位" },
                { required: true, message: `请输入${this.getPageName()}名称` },
                { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="负责人:">
            {getFieldDecorator("charge", {
              //【负责人】支持模糊搜索，最长字符可输入10个。
              initialValue: this.getInitData(modalData, "charge"),
              rules: [{ max: 10, message: "最长10位" }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="地址:">
            {getFieldDecorator("address", {
              //【客户名称】支持中文、英文、数字，最多50个字符；
              initialValue: this.getInitData(modalData, "address"),
              rules: [{ required: true, message: '请输入地址' }, { max: 100, message: "最长100位" }, { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人:">
            {getFieldDecorator("contacts", {
              //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
              initialValue: this.getInitData(modalData, "contacts"),
              rules: [{ max: 20, message: "最长20位" }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="电话号码:">
            {getFieldDecorator("mobile", {
              //【电话号码】支持数字，允许输入特殊字符，最多50个字符；
              initialValue: this.getInitData(modalData, "mobile"),
              rules: [{ max: 50, message: "最长50位" }, { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="微信/QQ:">
            {getFieldDecorator("wxqq", {
              //【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
              initialValue: this.getInitData(modalData, "wxqq"),
              rules: [{ max: 100, message: "最长100位" }, { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          {pageType === "c" ? null : (
            <FormItem {...formItemLayout} label="优势线路:">
              {getFieldDecorator("predominantLine", {
                //【微信/QQ】支持中文、英文、数字，允许输入特殊字符，小写英文自动转换为大写，最多100个字符
                initialValue: this.getInitData(modalData, "predominantLine"),
                rules: [{ max: 200, message: "最长200位" }],
              })(
                <TextArea
                  placeholder="请输入"
                  autosize={{ minRows: 2, maxRows: 10 }}
                />
                )}
            </FormItem>
          )}
          <FormItem {...formTailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalConfirmLoading}
            >
              确认
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                this.handleCancel();
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
    const { customerMannagement: { showModal }, modalType } = this.props;
    return (
      <Modal
        title={
          modalType === "add"
            ? `新增${this.getPageName()}`
            : `修改${this.getPageName()}`
        }
        visible={showModal}
        onCancel={() => this.handleCancel(false)}
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
  handleCancel(showModal) {
    const { dispatch } = this.props;
    dispatch({
      type: "customerMannagement/extendAll",
      payload: { showModal },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const {
      dispatch,
      formValues: searchFormValues,
      customerMannagement: { showModal, modalConfirmLoading, deleteItemId, data: { data: dataList } },
      page,
    } = this.props;
    return (
      <Modal
        title={null}
        visible={showModal}
        onCancel={() => this.handleCancel(false)}
        maskClosable={false}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: "center", lineHeight: "3.5em" }}>
          <h3>是否确认删除</h3>
          <Button
            style={{ marginRight: 8 }}
            type="primary"
            loading={modalConfirmLoading}
            onClick={() => {
              dispatch({
                type: "customerMannagement/fetchDelete",
                payload: { id: deleteItemId },
                succCB: () => {
                  //添加条件，当不为第1页 && 仅为1条数据的的时候
                  if (page.pageNum > 1 && dataList.length === 1) {
                    page.pageNum -= 1;
                  }
                  dispatch({
                    type: "customerMannagement/fetch",
                    payload: {
                      ...page,
                      ...searchFormValues,
                    },
                  });
                },
              });
            }}
          >
            确认
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => this.handleCancel(false)}
          >
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

const AllModal = props => {
  const ModalView = props.modalType === "delete" ? DeleteModal : AddEditModal;
  return <ModalView {...props} />;
};

export default AllModal;
