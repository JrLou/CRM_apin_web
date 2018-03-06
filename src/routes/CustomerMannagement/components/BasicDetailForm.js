import { connect } from 'dva';
import PropTypes from 'prop-types';
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

  // componentWillUnmount() {
  //   uuid = 0;
  // }

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

          debugger;
          console.log('keysArr', keysArr);

          const newKeysArr = keysArr.map(currObj => {
            if (currObj.isMain && currObj.key !== chooseKey) {
              return { ...currObj, isMain: 0 };
            } else if (currObj.key === chooseKey) {
              return { ...currObj, isMain: 1 };
            } else {
              return currObj;
            }
          }); //[...keysArr, { key: uuid, isMain: 0 }];

          setFieldsValue({
            keysArr: newKeysArr,
          });

          dispatch({
            type: 'customerMannagement/extendAll',
            payload: { showModal: false },
          });
        }}
      />
    );
  };

  //返回值形如： [{ key: 0, isMain: 0 }] 或者 [{ key: 0, isMain: 1,... },{ key: 1, isMain: 0,... }]、
  getInitKeysArr = formData => {
    const { contactsList } = formData;
    let result = [];
    let innerUuid = -1; //TODO: 这里有坑，如果直接用uuid会有bug，但是找不到原因

    if (Array.isArray(contactsList)) {
      //有值
      result = contactsList.map(currObj => {
        innerUuid += 1;
        uuid = innerUuid;
        console.log('执行了getInitKeysArr,uuid', uuid);
        return { ...currObj, key: innerUuid };
      });
    } else {
      //没值
      result = [{ key: 0, isMain: 1 }];
    }
    return result;
  };

  // 创建可编辑的联系人部分
  createNewConnect = (
    formData,
    getFieldDecorator,
    setFieldsValue,
    layoutForm
  ) => {
    const {
      dispatch,
      form: { getFieldValue },
      customerMannagement: { connectInfo },
      isReadOnly,
    } = this.props;
    const itemSpan = 5;

    const initialValue = this.getInitKeysArr(formData);

    getFieldDecorator('keysArr', { initialValue }); //TODO: 这里的init改成与返回的值关联即可， 记得把上版本的冗余代码删除
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
                initialValue: obj.contacts,
                rules: [
                  { max: 20, message: '最长20位' },
                  { required: true, message: '请输入联系人' },
                ],
              })(<Input disabled={isReadOnly} />)}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="电话号码:">
              {getFieldDecorator(`mobile-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: obj.mobile,
                rules: [
                  { max: 50, message: '最长50位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(<Input disabled={isReadOnly} />)}
            </FormItem>
          </Col>
          <Col span={itemSpan}>
            <FormItem label="微信/QQ:">
              {getFieldDecorator(`wxqq-${key}`, {
                //【联系人】支持中文、英文，允许输入特殊字符，小写英文自动转换为大写，最多20个字符；
                initialValue: obj.wxqq,
                rules: [
                  { max: 100, message: '最长100位' },
                  { pattern: /^\s*\S+[\s\S]*$/, message: '不能输入纯空格' },
                ],
              })(<Input disabled={isReadOnly} />)}
            </FormItem>
          </Col>
          <Col span={3} style={{ textAlign: 'center' }}>
            <FormItem>
              {console.log('key', key)}
              {console.log('this.pageModalType', this.pageModalType)}
              {obj.isMain ? (
                <span style={{ color: '#f00' }}>主要联系人</span>
              ) : !isReadOnly ? (
                <a
                  onClick={() => {
                    this.pageModalType = { action: 'set', chooseKey: key };
                    console.log('绑定的key=', key);
                    dispatch({
                      type: 'customerMannagement/extendAll',
                      payload: { showModal: true },
                    });
                  }}
                >
                  设为主要联系人
                </a>
              ) : null}
            </FormItem>
          </Col>
          {keysArr.length > 1 && !isReadOnly ? (
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

    const addContactBtn = !isReadOnly ? (
      <FormItem style={{ float: 'right', zIndex: 2 }}>
        <Button type="primary" onClick={this.add}>
          新增联系人
        </Button>
      </FormItem>
    ) : null;

    return (
      <React.Fragment>
        {addContactBtn}
        {formItems}
      </React.Fragment>
    );
  };

  transferData = fieldsValue => {
    // const obj = {
    //   name: 'a',
    //   address: '1',
    //   charge: 'a',
    //   keysArr: [{ key: 0, isMain: 1 }, { key: 2, isMain: 0 }],
    //   'contacts-0': 'b',
    //   'contacts-2': 'd',
    //   'mobile-0': 'b',
    //   'mobile-2': 'd',
    //   'wxqq-0': 'b',
    //   'wxqq-2': 'd',
    // };
    /*************** 从上面的数据 变为 下面的数据 ***************/
    // const result = {
    //   name: '中国111',
    //   address: 'hangzhou',
    //   charge: 'sonkia',
    //   contactsList: [
    //     {
    //       id: '' TODO: 后台返回了此值，就原样返回，如果是新增的联系人，否则就返回{id:""}
    //       contacts: 'AAA',
    //       mobile: '123',
    //       wxqq: 'aa',
    //       isMain: 1,
    //     },
    //     {
    //       contacts: 'BBB',
    //       mobile: '456',
    //       wxqq: 'bb',
    //       isMain: 0,
    //     },
    //   ],
    // };

    //删除末尾的:—1,-2,-11等字符
    const delTailTxt = str => {
      const reg = /-\w+/;
      return str.replace(reg, '');
    };

    const { keysArr, name, address, charge, ...restData } = fieldsValue;
    const restKeysArr = Object.keys(restData);

    const contactsList = keysArr.reduce((acc, currObj, index) => {
      const tailTxt = `-${currObj.key}`;
      //获取匹配当前tailTxt的key数组
      const targetKeysArr = restKeysArr.filter(
        currKey => currKey.indexOf(tailTxt) !== -1
      );
      //生成了形如：[{contacts: 'BBB'},{mobile: 'BBB'}] 的数据
      const objArr = targetKeysArr.map(currKey => ({
        [delTailTxt(currKey)]: restData[currKey],
      }));
      const endObj = objArr.reduce(
        (accumulation, currentObj) => ({ ...accumulation, ...currentObj }),
        { isMain: currObj.isMain }
      );
      return [...acc, endObj];
    }, []);

    const jsonObj = { name, address, charge, contactsList };
    return jsonObj;
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      dispatch,
      form: { getFieldValue, validateFields },
      handlePageFormReset,
      customerMannagement: { formData: { data: formData } },
    } = this.props;

    const keysArr = getFieldValue('keysArr');

    validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) return;

      // const { customerMannagement: { connectInfo } } = this.props;

      // 添加 微信 qq 的验证
      for (let i = 0; i < keysArr.length; i += 1) {
        const { key } = keysArr[i];
        if (!fieldsValue[`mobile-${key}`] && !fieldsValue[`wxqq-${key}`]) {
          message.warning('微信/QQ、电话号码请至少填一个');
          return;
        }
      }

      const payload = this.transferData(fieldsValue);

      dispatch({
        type: `customerMannagement/fetchAdd`,
        payload,
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
    const newKeysArr = [...keysArr, { key: uuid, isMain: 0 }];
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
      form: { getFieldDecorator, setFieldsValue },
      customerMannagement: {
        modalConfirmLoading,
        formData: { data: formData },
      },
      needOperateBtn,
      isReadOnly,
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
                  initialValue: this.getInitData(formData, 'name'),
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
                })(<Input disabled={isReadOnly} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="负责人:">
                {getFieldDecorator('charge', {
                  //【负责人】支持模糊搜索，最长字符可输入10个。
                  initialValue: this.getInitData(formData, 'charge'),
                  rules: [{ max: 10, message: '最长10位' }],
                })(<Input disabled={isReadOnly} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="地址:">
                {getFieldDecorator('address', {
                  //【客户名称】支持中文、英文、数字，最多50个字符；
                  initialValue: this.getInitData(formData, 'address'),
                  rules: [
                    { required: true, message: '请输入地址' },
                    { max: 100, message: '最长100位' },
                    {
                      pattern: /^\s*\S+[\s\S]*$/,
                      message: '不能输入纯空格',
                    },
                  ],
                })(<Input disabled={isReadOnly} />)}
              </FormItem>
            </Col>
          </Row>
          {/* 可编辑的联系人部分 */}
          {this.createNewConnect(
            formData,
            getFieldDecorator,
            setFieldsValue,
            layoutForm
          )}
        </SingleBlock>
        {needOperateBtn ? (
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
        ) : null}
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

BasicDetailForm.defaultProps = {
  needOperateBtn: true,
  isReadOnly: false,
};

BasicDetailForm.propTypes = {
  needOperateBtn: PropTypes.bool, //是否显示form的【返回】【保存】
  isReadOnly: PropTypes.bool,
};

export default BasicDetailForm;
