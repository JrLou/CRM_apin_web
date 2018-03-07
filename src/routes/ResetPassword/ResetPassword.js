import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { Base64 } from 'js-base64';
import CookieHelp from '../../utils/cookies';

const FormItem = Form.Item;

@connect(state => ({ resetPassword: state.resetPassword }))
@Form.create()
class ResetPassword extends PureComponent {
  getCookValue = key => {
    return CookieHelp.getCookieInfo(key)
      ? Base64.decode(CookieHelp.getCookieInfo(key))
      : '';
  };
  
  fetchResetPassword = () => {
    //发起请求
    this.props.dispatch({
      action: 'resetPassword/fetch',
      payload: {},
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'resetPassword/fetch',
          payload: values,
        });
      }
    });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value === form.getFieldValue('password')) {
      callback('新密码与原密码相同');
    } else {
      callback();
    }
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const name = this.getCookValue('_u');
    const mobile =
      this.getCookValue('_m') === 'null' ? null : this.getCookValue('_m'); //cook会自动绑定为字符串null
    const account = this.getCookValue('_c');

    const {
      form: { getFieldDecorator },
      resetPassword: { loading },
    } = this.props;

    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ maxWidth: '600px' }}
        hideRequiredMark
      >
        <FormItem {...formItemLayout} label="账户名">
          {getFieldDecorator('account', { initialValue: account })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('name', { initialValue: name })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('mobile', { initialValue: mobile })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="旧密码">
          {getFieldDecorator('oldpwd', {
            rules: [
              {
                required: true,
                message: '请输入你的旧密码',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('newpwd', {
            rules: [
              {
                required: true,
                message: '请输入你的新密码',
              },
              {
                //TODO: 这个正则太恶心了，而且还没有位数,而且还不对
                pattern: /^([a-zA-Z]+[0-9]+[a-zA-Z0-9]*)|([0-9]+[a-zA-Z]+[a-zA-Z0-9]*)$/,
                message: '需输入6至20位密码，含有数字及字母',
              },
              {
                max: 20,
                message: '需输入6至20位密码，含有数字及字母',
              },
              {
                min: 6,
                message: '需输入6至20位密码，含有数字及字母',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存修改
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default ResetPassword;
