import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Tabs, Card, Row, Col, Form, Input, Button, message, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ConfirmModal from './components/ConfirmModal';
import styles from './Template.less';

const { TabPane } = Tabs;
const { Item: FormItem } = Form;

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
@Form.create()
class AddCustomer extends PureComponent {
  constructor(props) {
    super(props);
    this.delKey = 0; //删除的key值
  }
  getInitData = (data, key) => {
    if (!data) return;
    return data[key] || '';
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
      console.log('fieldsValue', fieldsValue);
      if (err) return;

      const { customerMannagement: { connectInfo } } = this.props;

      // 添加 微信 qq 的验证
      for (const k in connectInfo) {
        if (
          !fieldsValue[`mobile-${connectInfo[k].key}`] &&
          !fieldsValue[`wxqq-${connectInfo[k].key}`]
        ) {
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

  // 创建可编辑的联系人部分
  createNewConnect = (modalData, getFieldDecorator, layoutForm) => {
    const {
      dispatch,
      form: { setFieldsValue },
      customerMannagement: { connectInfo },
    } = this.props;
    const itemSpan = 5;

    const newKeys = connectInfo.reduce((accumulator, v, k) => {
      return [...accumulator, ...Object.keys(v)];
    }, []);

    // setFieldsValue({
    //   keys: newKeys,
    // });

    const formItems = connectInfo.map(currObj => {
      const { key } = currObj;
      return (
        <Row gutter={layoutForm} key={key}>
          <Col span={itemSpan}>
            <FormItem label="联系人:">
              {getFieldDecorator(`contacts-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: currObj.contacts,
                rules: [{ max: 20, message: '最长20位' }],
              })(
                <Input
                  placeholder="请输入"
                  onChange={e => {
                    this.saveChange(e, key, 'contacts');
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="电话号码:">
              {getFieldDecorator(`mobile-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: currObj.mobile,
                rules: [
                  { max: 50, message: '最长50位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(
                <Input
                  placeholder="请输入"
                  onChange={e => {
                    this.saveChange(e, key, 'mobile');
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator(`wxqq-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: currObj.wxqq,
                rules: [
                  { max: 100, message: '最长100位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(
                <Input
                  placeholder="请输入"
                  onChange={e => {
                    this.saveChange(e, key, 'wxqq');
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3} style={{ textAlign: 'center' }}>
            <FormItem>主要联系人</FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button
                onClick={() => {
                  this.delKey = currObj.key;
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
        </Row>
      );
    });

    return (
      <React.Fragment>
        {formItems}
        <Row gutter={layoutForm}>
          <Col span={21} />
          <Col span={3}>
            <FormItem>
              <Button
                onClick={() => {
                  dispatch({
                    type: 'customerMannagement/addOneConnect',
                  });
                }}
              >
                新增联系人
              </Button>
            </FormItem>
          </Col>
        </Row>
      </React.Fragment>
    );
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
      form: { getFieldDecorator },
      customerMannagement: { modalConfirmLoading, modalData },
    } = this.props;
    const layoutForm = { md: 8, lg: 24, xl: 48 };

    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
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
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
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
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        {/* 可编辑的联系人部分 */}
        {this.createNewConnect(modalData, getFieldDecorator, layoutForm)}
        <Row gutter={layoutForm}>
          <Col span={24}>
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              返回
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalConfirmLoading}
            >
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    console.log('render');
    const { dispatch } = this.props;
    const formView = (
      <div className={styles.tableListForm}>{this.renderForm()}</div>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tabs type="card">
            <TabPane tab="基础信息" key="0">
              {formView}
              <ConfirmModal
                title="是否确认删除"
                handleOK={() => {
                  console.log(this.delKey);
                  dispatch({
                    type: `customerMannagement/delOneConnect`,
                    payload: { key: this.delKey },
                  });

                  const { customerMannagement: { connectInfo } } = this.props;
                  connectInfo.forEach((v, k) => {
                    console.log('v', v);
                    this.props.form.setFieldsValue({
                      [`contacts-${k}`]: v.contacts,
                      [`mobile-${k}`]: v.mobile,
                      [`wxqq-${k}`]: v.wxqq,
                      // key: v.key,
                    });
                  });

                  dispatch({
                    type: 'customerMannagement/extendAll',
                    payload: { showModal: false },
                  });
                }}
              />
              {/* <DynamicFieldSet /> */}
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}

let uuid = 0;
@Form.create()
class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    debugger;
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid += 1;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    console.log('render');
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Passengers' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`abcd-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(
            <Input
              placeholder="passenger name"
              style={{ width: '60%', marginRight: 8 }}
            />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add field
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default AddCustomer;
