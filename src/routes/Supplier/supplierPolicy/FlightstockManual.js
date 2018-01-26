import React, {Component} from 'react'
import {
  Checkbox, Col, Form, Input, Select, Button, Row,
} from 'antd'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class HorizontalLoginForm extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  constructor(props) {
    super(props);
    this.state = {
      formLayout: 'horizontal', //from布局控件
      fcategory: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.manual = true
        // values.fcategory=this.state.fcategory,
        this.props.open(values);
        // console.log('Received values of form: ', values);
      }
    });
  }

  valHeadquarters(checkedValue) {
    console.log(checkedValue);
  }

  handleChange(value) {
    this.setState({
      fcategory: value,
    });
  }

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const {formLayout} = this.state;
    const requiredText = '请填写此字段';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: {span: 6},
      wrapperCol: {span: 17},
    } : null;
    const optionsWithDisabled = [
      {value: 1, label: '星期一'},
      {value: 2, label: '星期二'},
      {value: 3, label: '星期三'},
      {value: 4, label: '星期四'},
      {value: 5, label: '星期五'},
      {value: 6, label: '星期六'},
      {value: 0, label: '星期天'},
    ];
    return (

      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={{md: 8, lg: 24, xl: 48}} style={{textAlign: 'center', display: "block"}}>
          <Col md={6} sm={24}>
            <Col md={24} sm={24}>
              <p
                style={{marginLeft: '20px', textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>航班号:</p>
            </Col>
            <Col md={24} sm={24}>
              <p style={{textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>航空公司:</p>
            </Col>
          </Col>
          <Col md={18} sm={24} style={{marginLeft: '-10px'}}>
            <Col md={24} sm={24}>
              <FormItem
                style={{marginBottom: "15px"}}
              >
                {getFieldDecorator('FlightNo', {
                  rules: [{
                    required: true,
                    message: requiredText
                  }, {max: 6, message: "航班号最长六位"}, {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: "只能输入字母和数字"
                  }],
                  // initialValue: this.state.account.csCharger
                })
                (< Input placeholder="请填写航班号" style={{width: '300px', marginLeft: '-50px'}}/>)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem
                style={{marginBottom: "20px"}}
              >
                {getFieldDecorator('FlightCompany', {
                  rules: [{
                    required: true,
                    message: requiredText
                  }],
                  // initialValue: this.state.account.csCharger
                })
                (< Input placeholder="请填写" style={{width: '300px', marginLeft: '-50px'}}/>)}
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}} style={{textAlign: 'center'}}>
          <Col md={18} sm={24} style={{float: "right"}}>
            <Col md={12} sm={24}>
              <span style={{textAlign: 'center'}}>起飞</span>
            </Col>
            <Col md={12} sm={24}>
              <span style={{textAlign: 'center'}}>到达</span>
            </Col>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}} style={{textAlign: 'center', display: "block"}}>
          <Col md={6} sm={24}>
            <Col md={24} sm={24}>
              <p style={{textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>时间:</p>
            </Col>
            <Col md={24} sm={24}>
              <p style={{textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>城市:</p>
            </Col>
            <Col md={24} sm={24}>
              <p style={{textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>机场三字码:</p>
            </Col>
            {!this.props.h5 &&
            <Col md={24} sm={24}>
              <p style={{textAlign: 'right', lineHeight: '40px', color: 'rgba(0, 0, 0, 0.85)'}}><span
                style={{color: 'red'}}>*</span>周期选择:</p>
            </Col>
            }
          </Col>
          <Col md={18} sm={24} style={{marginLeft: '-10px'}}>
            <Col md={24} sm={24}>
              <Col md={12} sm={24}>
                <FormItem style={{marginBottom: "20px",}}>
                  {getFieldDecorator('FlightDeptimePlanDate', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, message: "格式错误"}],
                  })
                  (<Input placeholder="如（12:30）" style={{marginLeft: '-22px', width: '147px'}}/>)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem
                  style={{marginLeft: "-20px", marginLeft: '-67px'}}
                >
                  {getFieldDecorator('FlightArrtimePlanDate', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, message: "格式错误"}],
                  })
                  (<Input placeholder="如（12:30）" style={{width: '147px'}}/>)}
                </FormItem>
              </Col>
            </Col>

            <Col md={24} sm={24}>
              <Col md={12} sm={24}>
                <FormItem style={{marginBottom: "20px"}}>
                  {getFieldDecorator('FlightDep', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {pattern: /^[\u2E80-\u9FFF]+$/, message: "请输入正确城市"}],
                  })
                  (<Input placeholder="请输入城市" style={{marginLeft: '-22px', width: '147px'}}/>)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem
                  style={{marginLeft: "-20px", marginLeft: '-67px'}}
                >
                  {getFieldDecorator('FlightArr', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {pattern: /^[\u2E80-\u9FFF]+$/, message: "请输入正确城市"}],
                  })
                  (<Input placeholder="请输入城市" style={{width: '147px'}}/>)}
                </FormItem>
              </Col>
            </Col>
            <Col md={24} sm={24}>
              <Col md={12} sm={24}>
                <FormItem style={{marginBottom: "20px"}}>
                  {getFieldDecorator('FlightDepcode', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {max: 3, message: '只能输入三位'}, {pattern: /^[a-zA-Z]{3}$/, message: "请输入正确三字码"}],
                  })
                  (<Input placeholder="机场三字码" style={{marginLeft: '-22px', width: '147px'}}/>)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem
                  style={{marginLeft: "-20px", marginLeft: '-67px'}}
                >
                  {getFieldDecorator('FlightArrcode', {
                    rules: [{
                      required: true,
                      message: requiredText
                    }, {max: 3, message: '只能输入三位'}, {pattern: /^[a-zA-Z]{3}$/, message: "请输入正确三字码"}],
                  })
                  (<Input placeholder="机场三字码" style={{width: '147px'}}/>)}
                </FormItem>
              </Col>
            </Col>
            {!this.props.h5 &&
            < Col md={24} sm={24}>
              <FormItem>
                {getFieldDecorator('flights', {
                  rules: [{
                    required: true,
                    message: requiredText
                  }],
                })
                (<CheckboxGroup options={optionsWithDisabled}
                                onChange={this.valHeadquarters.bind(this)}/>)}
              </FormItem>
            </Col>
            }
          </Col>
          <FormItem>
            <Button style={{marginLeft: '41%'}} type="primary" htmlType="submit">提交录入</Button>
          </FormItem>
        </Row>
      </Form>

    )
      ;
  }
}

const WrappedAddForms = Form.create()(HorizontalLoginForm);
module.exports = WrappedAddForms;
