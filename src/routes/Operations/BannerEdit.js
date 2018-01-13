import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { Card, Form, Row, Col, Input, Button, Select, Radio, DatePicker, message, Upload, Icon } from 'antd';
import styles from './BannerEdit.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PicturesWall from './PicturesWall.js';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect(state => ({
  bannerList: state.bannerList,
}))
@Form.create()
class BannerEdit extends PureComponent {
  componentWillMount() {
    if (this.props.edit) {
      if (JSON.stringify(this.props.bannerList.editData)=='{}') {
        this.props.dispatch(routerRedux.push('/operations/banner'));
      }
    }
  }
  // onChange = (date, dateString) => {
  //   this.setState({
  //     start_time: dateString[0],
  //     end_time: dateString[1],
  //   });
  // }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { bannerList: { banner_url } } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (!values.validityTime[0] || !values.validityTime[1]) {
        message.warning('请输入图片有效期');
        return;
      }
      if (!banner_url) {
        message.warning('请上传图片');
        return;
      }
      values.start_time = moment(values.validityTime[0]).format('YYYY-MM-DD HH:mm');
      values.end_time = moment(values.validityTime[1]).format('YYYY-MM-DD HH:mm');
      values.banner_url = banner_url;
      delete (values["validityTime"]);
      delete (values["actionType"]);
      if(this.props.edit){
        dispatch({
          type: 'bannerList/checkEdit',
          payload: values,
          callback: (response) => {
            if (response.code == 1) {
              console.log(response);
            } else {
              console.log(response.msg);
            }
          }
        });
      }else{
        delete (values["id"]);
        dispatch({
          type: 'bannerList/addBanner',
          payload: values,
          callback: (response) => {
            if (response.code == 1) {
              console.log(response);
            } else {
              console.log(response.msg);
            }
          }
        });
      }
    });
  };

  cancelEdit = () => {
    this.props.dispatch({
      type: 'bannerList/cancelEdit',
    })
  };
  render() {
    const { bannerList: { editData: data } } = this.props;

    const { getFieldDecorator } = this.props.form;
    let validityStart = data.start_time ? moment(data.start_time) : undefined;
    let validityEnd = data.end_time ? moment(data.end_time) : undefined;
    let validityTime = [validityStart, validityEnd];

    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 14 },
      },
    };
    const fileList = [];
    const upimgprops = {
      action: '',
      listType: 'picture',
      defaultFileList: fileList,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Form onSubmit={this.handleSubmit}>
                  {getFieldDecorator('id', {
                    initialValue: data.id ? data.id :'',
                  })
                    (<Input placeholder="请输入…" type='hidden' />)
                  }
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="图片名称:" {...formItemLayout}>
                  {getFieldDecorator('title', {
                    initialValue: data.title ? data.title : undefined,
                    rules: [{ max: 32, message: '长度不能超过32' }, { required: true, message: '请填写图片名称' }],
                  })
                    (<Input placeholder="请输入…" />)
                  }
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col md={16} sm={24}>
                <FormItem label="显示顺序:" {...formItemLayout}>
                  {getFieldDecorator('index', { initialValue: data.index ? data.index : undefined, rules: [{ required: true, message: '请选择显示顺序' }], })
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
                  <PicturesWall />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <FormItem label="指向方式:" {...formItemLayout}>
                  {getFieldDecorator('actionType', { initialValue: 1, rules: [{ required: true, message: '请选择指向方式' }], })
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
                  {getFieldDecorator('link_url', { initialValue: data.link_url ? data.link_url : '',rules: [{ required: false, message: '请输入指向地址' }]})
                    (<Input placeholder="请输入…" />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col md={16} sm={24}>
                  <FormItem label="图片有效期:" {...formItemLayout}>
                    {getFieldDecorator('validityTime', { initialValue: validityTime, rules: [{ required: true, message: '请选择图片有效期' }], })
                      (
                      <RangePicker style={{width:'100%'}} format="YYYY-MM-DD HH:mm" />
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={16} sm={24}>
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('state', { initialValue: data.state == 0 ? 0 : 1, rules: [{ required: true, message: '请选择状态' }], })
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
                    <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit">确认</Button>
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
