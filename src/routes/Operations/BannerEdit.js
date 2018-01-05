import React, {PureComponent} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {Card, Form, Row, Col, Input, Button,Select,Radio,DatePicker} from 'antd';
import styles from './BannerEdit.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

@connect(state => ({
  bannerList: state.bannerList,
}))
@Form.create()

class BannerEdit extends PureComponent {
  state = {};

  handleSubmit = (e) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      console.log(values);

      dispatch({
        type: 'bannerList/fetch',
        payload: values,
      });
    });
  };

  cancelEdit = () => {
    this.props.dispatch({
      type: 'bannerList/cancelEdit',
    })
  };

  render() {
    const { editData, loading } = this.props;
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        sm: {span: 6},
      },
      wrapperCol: {
        sm: {span: 14},
      },
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="图片名称:" {...formItemLayout}>
                  {getFieldDecorator('imgName', {
                    initialValue: "",
                    rules: [{max: 30, message: '长度不能超过30'}, {required: true, message: '请填写图片名称'}],
                  })
                  (<Input placeholder="请输入…"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="显示顺序:" {...formItemLayout}>
                  {getFieldDecorator('index', {initialValue: undefined, rules: [{required: true, message: '请选择显示顺序'}],})
                  (
                    <Select placeholder="请选择">
                      <Option key={1}>1</Option>
                      <Option key={2}>2</Option>
                      <Option key={3}>3</Option>
                      <Option key={4}>4</Option>
                      <Option key={5}>5</Option>
                    </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="上传图片:" {...formItemLayout}>
                  {getFieldDecorator('imgUrl', {initialValue: "", rules: [{required: true, message: '请选择图片'}],})
                  (<Input placeholder="请输入…"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="指向方式:" {...formItemLayout}>
                  {getFieldDecorator('actionType', {initialValue: 1, rules: [{required: true, message: '请选择指向方式'}],})
                  (
                    <RadioGroup>
                      <Radio value={1}>链接</Radio>
                    </RadioGroup>
                  )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="指向地址:" {...formItemLayout}>
                  {getFieldDecorator('goLink', {initialValue: "", rules: [{max: 128, message: '长度不能超过128'},{required: true, message: '请输入指向地址'}],})
                  (<Input placeholder="请输入…"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col md={16} sm={24}>
                  <FormItem label="图片有效期:" {...formItemLayout}>
                    {getFieldDecorator('validity', {initialValue: "", rules: [{required: true, message: '请选择图片有效期'}],})
                    (
                      <RangePicker
                        showTime={{
                          format:'HH:mm',
                        }}
                        format="YYYY-MM-DD HH:mm"
                      />
                    )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={16} sm={24}>
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('status', {initialValue: 1, rules: [{required: true, message: '请选择状态'}],})
                    (
                      <RadioGroup>
                        <Radio value={1}>上架</Radio>
                        <Radio value={0}>下架</Radio>
                      </RadioGroup>
                    )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={16} sm={24}>
                  <div className={styles.btns}>
                    <Button onClick={() => {
                      this.cancelEdit()
                    }}>取消</Button>
                    <Button style={{marginLeft: 20}} type="primary" htmlType="submit">确认</Button>
                  </div>
                </Col>
              </Row>
            </Row>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default BannerEdit;
