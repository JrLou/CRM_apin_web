/**
 * Created by lixifeng on 16/10/25.
 */
//筛选公共封装组件
//引入该文件可快速构建列表筛选的input组
//案例 <Filter formData={formData}                                              ========》formData为所传入的所需的form表单数组
//            dataProcess={this.dataProcess.bind(this)}                        ========》为您在父组件接收筛选条件的回调函数
//            add={this.companyname.bind(this, 0)}/> {this.getTableView()}     ========》为如果您的筛选中有新增按钮add为点击新增后的执行函数

//案例  传入该数组的数据
// const formData = {
//     added: '新增政策',
//     list: [
//         {name: '出发城市',           ========》name 为input的输入提示，
//          id: 'departureCity',       ========》id是像后端传的参数名，
//          required: false,           ========》required为必填与或者不必填（true:必填，false:不必填），
//          category: 0,},              ========》 category为输入类型（0为input框，1为下拉选择，2时间选择），
//         {
//             name: '请选择有效性',
//             id: 'airlineStatus',
//             required: false,
//             category: 1,
//             disabled: 1,               ========》 disabled为下拉选择时的默认选项，
//             options: [{name: '待上架', id: '0'}, {name: '上架', id: '1',}]
//         },
//         {
//             name: '出发时间',
//             id: 'departureTime',
//             required: false,
//             category: 2,
//         },
//     ],
// };
import React, {Component} from 'react';
import css from './Filter.less';
import {
  Button,
  Input,
  Select,
  Form,
  Row,
  Col,
  DatePicker,
} from 'antd';

const Option = Select.Option;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;

class HorizontalLoginForm extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoadingSearch: false,
      isLoadingRet: false
    };
  }

  clearNullValue(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!obj[key] && obj[key] !== 0) {
          delete obj[key];
        }
      }
    }
    return obj
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      isLoadingSearch: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dataProcess(this.clearNullValue(values), () => {
          setTimeout(() => {
            this.setState({
              isLoadingSearch: false
            });
          }, 500);
        });
      }
    });
  }

  //重置
  resetValue() {
    this.props.form.resetFields();
    this.setState({
      isLoadingRet: true
    })
    let values = this.props.form.getFieldsValue()
    this.props.dataProcess(this.clearNullValue(values), () => {
      setTimeout(() => {
        this.setState({
          isLoadingRet: false
        });
      }, 500);
    });
  }

  render() {
    const {getFieldDecorator,} = this.props.form;
    const {formLayout} = this.state;
    const requiredText = '请填写此字段';
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    };
    const formData = this.props.formData.list;

    const formssd = () => {
      let data = [];
      for (let i = 0; i < formData.length; i++) {
        let content = [{
          required: formData[i].required,
          message: requiredText
        }];
        if (formData[i].check) {
          for (let j = 0; j < formData[i].check.length; j++) {
            content.push(formData[i].check[j])
          }
        }
        switch (formData[i].category) {
          case 0:
            data.push(<Col md={8} sm={24}>
              <FormItem
                key={i}
                label={formData[i].name}
                {...formItemLayout}
                style={{marginBottom: "20px"}}
              >
                {getFieldDecorator(formData[i].id, {
                  rules: content,
                  // initialValue: this.state.account.csCharger
                })
                (< Input placeholder={"请填写" + formData[i].name} style={{width: '200px'}}/>)}
              </FormItem> </Col>
            )
            break;
          case 1:
            var provinceOptions = formData[i].options ? formData[i].options.map((v, k) => <Option
              value={v.id} key={k}>{v.name}</Option>) : null;
            data.push(<Col md={8} sm={24}><FormItem
              key={i}
              label={formData[i].name}
              {...formItemLayout}
              style={{marginBottom: "20px"}}
            >
              {getFieldDecorator(formData[i].id, {
                rules: content,
                initialValue: formData[i].disabled ? formData[i].options[formData[i].disabled].id : '',
              })
              (<Select style={{width: 200}} placeholder={formData[i].placeholder}>
                {provinceOptions}
              </Select>)}
            </FormItem></Col>)
            break;
          case 2:
            data.push(<Col md={8} sm={24}><FormItem
              key={i}
              label={formData[i].name}
              {...formItemLayout}
              style={{marginBottom: "20px"}}
            >
              {getFieldDecorator(formData[i].id, {
                rules: content,
                // initialValue: this.state.account.csCharger
              })
              (<RangePicker
                style={{width: 200,}}
                showToday={true}
              />)}
            </FormItem></Col>)
            break;
        }

      }
      return data;
    }
    return (
      <Form className={css.formsw} layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          {formssd()}
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
          <FormItem>
            {/*<Button type="primary" htmlType="submit" style={{width:100}} loading={this.state.isLoadingSearch}>搜索</Button>*/}
            <Button type="primary" htmlType="submit" style={{width: 100}}>查询</Button>
          </FormItem>
          <FormItem>
            {/*<Button loading={this.state.isLoadingRet} style={{width:100}} onClick={this.resetValue.bind(this)}>重置</Button>*/}
            <Button style={{width: 100}} onClick={this.resetValue.bind(this)}>重置</Button>
          </FormItem>
            {this.props.formData.added &&
            <FormItem>
              <Button type="primary" onClick={this.props.add.bind(this)}>{this.props.formData.added}</Button>
            </FormItem>
            }
          </span>
        </div>
      </Form>

    );
  }
}

const WrappedAddForms = Form.create()(HorizontalLoginForm);

export default WrappedAddForms
