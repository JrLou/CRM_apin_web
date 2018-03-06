import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Card, Row, Col, Form, Input, Button, message } from 'antd';
import SingleBlock from './SingleBlock';
import ConfirmModal from './ConfirmModal';
import styles from '../CustomerMannagement.less';

const { Item: FormItem } = Form;

let uuid = 0;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
class BasicDetailForm extends PureComponent {
  constructor(props) {
    super(props);
    this.pageModalType = { action: 'del', chooseKey: 0 }; //action => 模态框是【删除】 OR 【设置】, chooseKey => 操作的项
  }

  getInitData = (data, key) => {
    if (!data) return;
    return data[key] || '';
  };

  getConfirmModalView = () => {
    const { chooseKey } = this.pageModalType;
    const { dispatch } = this.props;

    return this.pageModalType.action === 'del' ? (
      <ConfirmModal
        title="确认删除？"
        handleOK={() => {
          this.remove(chooseKey);
          dispatch({
            type: 'customerMannagement/extendAll',
            payload: { showModal: false },
          });
        }}
      />
    ) : (
      <ConfirmModal
        title="确认设为主要联系人？"
        handleOK={() => {
          //调整keysArr的数据，设为主要联系人
          const { form: { getFieldValue, setFieldsValue } } = this.props;
          const keysArr = getFieldValue('keysArr');

          const newKeysArr = keysArr.map(currObj => {
            if (currObj.isMain && currObj.key !== chooseKey) {
              return { ...currObj, isMain: false };
            } else if (currObj.key === chooseKey) {
              return { ...currObj, isMain: true };
            } else {
              return currObj;
            }
          }); //[...keysArr, { key: uuid, isMain: false }];

          setFieldsValue({
            keysArr: newKeysArr,
          });

          console.log(
            '设置为主要联系人的chooseKey',
            this.pageModalType.chooseKey
          );
          dispatch({
            type: 'customerMannagement/extendAll',
            payload: { showModal: false },
          });
        }}
      />
    );
  };

  // 创建可编辑的联系人部分
  createNewConnect = (modalData, getFieldDecorator, layoutForm) => {
    const {
      dispatch,
      form: { getFieldValue },
      customerMannagement: { connectInfo },
    } = this.props;
    const itemSpan = 5;

    const newKeys = connectInfo.reduce((accumulator, v, k) => {
      return [...accumulator, ...Object.keys(v)];
    }, []);

    getFieldDecorator('keysArr', { initialValue: [{ key: 0, isMain: true }] }); //TODO: 这里的init改成与返回的值关联即可， 记得把上版本的冗余代码删除
    const keysArr = getFieldValue('keysArr');
    const formItems = keysArr.map((obj, index) => {
      const { key } = obj;
      const contactTailTxt = index + 1;

      return (
        <Row gutter={layoutForm} key={key}>
          <Col span={itemSpan}>
            <FormItem label={`联系人:${contactTailTxt}`}>
              {getFieldDecorator(`contacts-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                // initialValue: currObj.contacts,
                rules: [
                  { max: 20, message: '最长20位' },
                  { required: true, message: '请输入联系人' },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="电话号码:">
              {getFieldDecorator(`mobile-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                // initialValue: currObj.mobile,
                rules: [
                  { max: 50, message: '最长50位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator(`wxqq-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                // initialValue: currObj.wxqq,
                rules: [
                  { max: 100, message: '最长100位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={3} style={{ textAlign: 'center' }}>
            <FormItem>
              {obj.isMain ? (
                <span style={{ color: '#f00' }}>主要联系人</span>
              ) : (
                <a
                  onClick={() => {
                    this.pageModalType = { action: 'set', chooseKey: key };
                    dispatch({
                      type: 'customerMannagement/extendAll',
                      payload: { showModal: true },
                    });
                  }}
                >
                  设为主要联系人
                </a>
              )}
            </FormItem>
          </Col>
          {keysArr.length > 1 ? (
            <Col span={3}>
              <FormItem>
                <Button
                  onClick={() => {
                    this.pageModalType = { action: 'del', chooseKey: key };
                    dispatch({
                      type: 'customerMannagement/extendAll',
                      payload: { showModal: true },
                    });
                  }}
                >
                  删除
                </Button>
              </FormItem>
            </Col>
          ) : null}
        </Row>
      );
    });

    return (
      <React.Fragment>
        {/* <Row gutter={layoutForm} style={{ float: 'right' }}>
          <Col > */}
        <FormItem style={{ float: 'right', zIndex: 2 }}>
          <Button type="primary" onClick={this.add}>
            新增联系人
          </Button>
        </FormItem>
        {/* </Col>
        </Row> */}
        {formItems}
      </React.Fragment>
    );
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      dispatch,
      form: { getFieldValue, validateFields },
      handlePageFormReset,
      modalType,
      customerMannagement: { modalData: { data: modalData } },
    } = this.props;

    const keysArr = getFieldValue('keysArr');

    validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) return;

      const { customerMannagement: { connectInfo } } = this.props;

      // 添加 微信 qq 的验证
      for (let i = 0; i < keysArr.length; i += 1) {
        const { key } = keysArr[i];
        if (!fieldsValue[`mobile-${key}`] && !fieldsValue[`wxqq-${key}`]) {
          message.warning('微信/QQ、电话号码请至少填一个');
          return;
        }
      }

      const values = {
        ...fieldsValue,
      };

      let urlLast = '';
      let payload = {};
      switch (modalType) {
        case 'add':
          urlLast = 'fetchAdd';
          payload = { ...values };
          break;
        case 'edit':
          urlLast = 'fetchEdit';
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keysArr = form.getFieldValue('keysArr');
    // We need at least one passenger
    if (keysArr.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keysArr: keysArr.filter(obj => obj.key !== k),
    });

    //删除后判断是否还有【isMain: true】, 如果没的话，则删除后把第一个联系人设置 【isMain】
    const nextKeysArr = form.getFieldValue('keysArr');
    const hasIsMain = nextKeysArr.some(currV => currV.isMain);
    if (!hasIsMain) {
      nextKeysArr[0].isMain = true;
      form.setFieldsValue({
        keysArr: nextKeysArr,
      });
    }
  };

  add = () => {
    uuid += 1;
    const { form } = this.props;
    // can use data-binding to get
    const keysArr = form.getFieldValue('keysArr');
    const newKeysArr = [...keysArr, { key: uuid, isMain: false }];
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keysArr: newKeysArr,
    });
  };

  saveChange = (e, key, keyName) => {
    debugger;
    const { customerMannagement: { connectInfo }, dispatch } = this.props;
    const value = e && e.target && e.target.value;
    const targetObj = connectInfo.find(obj => obj.key === key);
    targetObj[keyName] = value;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: { connectInfo },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator, getFieldValue },
      customerMannagement: { modalConfirmLoading, modalData },
    } = this.props;
    const layoutForm = { md: 8, lg: 24, xl: 48 };

    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <SingleBlock tab="基础信息">
          <Row gutter={layoutForm}>
            <Col md={8} sm={24}>
              <FormItem label="客户名称">
                {getFieldDecorator('name', {
                  //【客户名称】支持中文、英文、数字，最多50个字符；
                  initialValue: this.getInitData(modalData, 'name'),
                  rules: [
                    { max: 50, message: '最长50位' },
                    {
                      required: true,
                      message: `请输入客户名称`,
                    },
                    {
                      pattern: /^\s*\S+[\s\S]*$/,
                      message: '不能输入纯空格',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="负责人:">
                {getFieldDecorator('charge', {
                  //【负责人】支持模糊搜索，最长字符可输入10个。
                  initialValue: this.getInitData(modalData, 'charge'),
                  rules: [{ max: 10, message: '最长10位' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="地址:">
                {getFieldDecorator('address', {
                  //【客户名称】支持中文、英文、数字，最多50个字符；
                  initialValue: this.getInitData(modalData, 'address'),
                  rules: [
                    { required: true, message: '请输入地址' },
                    { max: 100, message: '最长100位' },
                    {
                      pattern: /^\s*\S+[\s\S]*$/,
                      message: '不能输入纯空格',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          {/* 可编辑的联系人部分 */}
          {this.createNewConnect(modalData, getFieldDecorator, layoutForm)}
        </SingleBlock>
        <Card bordered={false}>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              返回
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              htmlType="submit"
              loading={modalConfirmLoading}
            >
              保存
            </Button>
          </div>
        </Card>
      </Form>
    );
  }

  render() {
    const formView = (
      <div className={styles.tableListForm}>{this.renderForm()}</div>
    );
    const confirmModalView = this.getConfirmModalView();

    return (
      <React.Fragment>
        {formView}
        {confirmModalView}
      </React.Fragment>
    );
  }
}

export default BasicDetailForm;
