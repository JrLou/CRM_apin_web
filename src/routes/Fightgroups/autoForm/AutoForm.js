import {Form, Input, AutoComplete, Button, Select, Row, Col, DatePicker,} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const wapperAddCol = (Cpm, span, key, layout) => {
  let result = null;
  if (layout === "horizontal") {
    result = <Col span={span} key={key}>
      {Cpm}
    </Col>
  } else {
    result = Cpm;
  }
  return result;
};


@Form.create()
export default class AutoForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSearch = (e) => {
    const onSearch = this.props.data.onSearch;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      // Should format date value before submit.因为日期格式为moment;

      // for(let k in fieldsValue){
      //   if(fieldsValue[k] instanceof moment){
      //
      //   }else if(typeof fieldsValue[k] === 'object' && fieldsValue[k][0] instanceof moment && fieldsValue[k].length === 2){//当是[moment,moment]时
      //     console.log(fieldsValue[k]);
      //   }else {
      //     data[k] = fieldsValue[k];
      //   }
      // }
      const newData = this.props.data.data;
      for (let k = 0; k < newData.length; k++) {
        const type = newData[k].type;
        //直接这里对fieldsValue进行操作
        if (/^3/.test(type)) {
          const dataObj = newData[k];
          const key = dataObj.fieldDecorator;
          const momentValue = fieldsValue[key];
          if (!momentValue) {
            continue;
          }
          const formatProps = dataObj.backDataFormat || "YYYY-MM-DD 00:00:00";
          if (type === 3) {
            fieldsValue[key] = momentValue.format(formatProps);
          } else if (type === 3.1) {
            let key0 = dataObj.fieldDecorator.split("&")[0];
            let key1 = dataObj.fieldDecorator.split("&")[1];
            let momentValue0 = fieldsValue[key][0];
            let momentValue1 = fieldsValue[key][1];
            const formatProps = dataObj.backDataFormat || "YYYY-MM-DD 00:00:00";
            fieldsValue[key0] = momentValue0.format(formatProps);
            fieldsValue[key1] = momentValue1.format(formatProps);
            delete fieldsValue[key];
          }
        } else {}
      }
      // for(let k in newData){
      //   if(newData[k].type === 3){
      //     let key = newData[k].fieldDecorator;
      //     let momentValue = fieldsValue[key];
      //     if(!momentValue) {
      //       continue
      //     };
      //     const formatProps = newData[k].backDataFormat || "YYYY-MM-DD 00:00:00";
      //     //直接这里对fieldsValue进行操作
      //     fieldsValue[key] = momentValue.format(formatProps);
      //     fieldsValue = {
      //       ...fieldsValue,
      //       [key]:momentValue.format(formatProps),
      //     }
      //   } else if(newData[k].type === 3.1){
      //     let key = newData[k].fieldDecorator;
      //     let key0 = newData[k].fieldDecorator.split("&")[0];
      //     let key1 = newData[k].fieldDecorator.split("&")[1];
      //     if(!fieldsValue[key]) {
      //       continue
      //     };
      //     let momentValue0 = fieldsValue[key][0];
      //     let momentValue1 = fieldsValue[key][1];
      //
      //     const formatProps = newData[k].backDataFormat || "YYYY-MM-DD 00:00:00";
      //     //直接这里对fieldsValue进行操作
      //     fieldsValue[key0] = momentValue0.format(formatProps);
      //     fieldsValue[key1] = momentValue1.format(formatProps);
      //     fieldsValue = {
      //       ...fieldsValue,
      //       [key0]:momentValue0.format(formatProps),
      //       [key1]:momentValue1.format(formatProps),
      //     }
      //     delete fieldsValue[key];
      //   }
      // }

      //values里面有所有form的数据
      onSearch && onSearch(fieldsValue);
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.validateFields();
  };

  cloneObj = (obj) => {//深度克隆,对象或者数组
    if (obj == null) {
      return null;
    }
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      let val = obj[key];
      newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
    }
    return newObj;
  };

  /**
   *
   * @param obj
   * @returns null
   * 删除对象中值为undefined、null、的属性
   */
  clearNullValue(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!obj[key] && (obj[key] === undefined || obj[key] === null)) {
          delete obj[key];
        }
      }
    }
    return obj
  }

  /**
   *
   * @param formItemStyle4Self
   * @param formItemLayout4Each
   * @returns formItemStyle4Self 合并 formItemLayout4Each
   */
  getFormItemLayout4Self(formItemStyle4Self, formItemLayout4Each) {
    let {style, ...reprops} = formItemLayout4Each;
    style = Object.assign(style, formItemStyle4Self.style);
    return Object.assign({}, reprops, {style});
  }

  getFormItemLayout4EachAndFormBtnLayout(layout, formItemLayout4Each, formItemStyle4Each) {
    formItemLayout4Each = formItemLayout4Each;
    let formBtnLayout = {};
    try {
      formBtnLayout = layout === "horizontal" ? {
        wrapperCol: {span: formItemLayout4Each.wrapperCol.span, offset: formItemLayout4Each.labelCol.span},
      } : {};
    } catch (err) {
      formBtnLayout = {
        wrapperCol: {span: undefined, offset: undefined},
      };
    } finally {
      //formItemLayout4Each = formItemLayout4Each ＋ formItemLayout4Each；
      formItemLayout4Each = Object.assign({style: formItemStyle4Each}, formItemLayout4Each);
      formBtnLayout = Object.assign({style: formItemStyle4Each}, formBtnLayout);
    }
    return {formItemLayout4Each, formBtnLayout};
  }

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const {data, action} = this.props;
    const itemsData = this.props.data.data;
    const span = data.span || 24;
    const layout = data.layout || "inline";
    const {formItemLayout4Each, formBtnLayout} = this.getFormItemLayout4EachAndFormBtnLayout(layout, this.cloneObj(data.formItemLayout4Each), this.cloneObj(data.formItemStyle4Each));

    //生成所有表单控件
    const ColItems = itemsData.map((itemData, index) => {
      const type = itemData.type || 1;
      const label = itemData.label || undefined;
      const colon = itemData.colon == false ? false : true;

      const formItemLayout4Self = typeof itemData.formItemStyle4Self === "object" ?
        this.getFormItemLayout4Self({style: itemData.formItemStyle4Self}, this.cloneObj(formItemLayout4Each))
        : formItemLayout4Each;
      const fieldsProps = itemData.fieldsProps;

      // Only show error after a field is touched.
      const thisFieldError = isFieldTouched(itemData.fieldDecorator) && getFieldError(itemData.fieldDecorator);
      const option = this.clearNullValue({
        rules: itemData.rules || undefined,
        initialValue: itemData.initialValue || undefined,
      });
      const formItemProps = this.clearNullValue(Object.assign({}, {
        validateStatus: thisFieldError ? 'error' : '',
        help: thisFieldError || '',
        label: label,
        colon: colon,
      }));
      const formItemSonProps = this.clearNullValue(Object.assign({}, {
        prefix: itemData.prefix || undefined,
        suffix: itemData.suffix || undefined,
        placeholder: itemData.placeholder || undefined,
        type: itemData.htmlType || 'text',
        dataSource: itemData.dataSource || undefined,
        style: Object.assign({width: type < 5 ? "220px" : ""}, itemData.style),
      }, {...fieldsProps}));

      let formItemEle = null;
      switch (type) {
        case 1:
        default:
          formItemEle = <Input {...formItemSonProps}/>;
          break;
        case 1.1:
          formItemEle = <AutoComplete
            {...formItemSonProps}
          />;
          break;
        case 2:
          console.log("formItemSonProps",formItemSonProps);
          formItemEle = <Select {...formItemSonProps}>
            {itemData.options.map(option => <Option key={option.value} value={option.value}>{option.txt}</Option>)}
          </Select>;
          break;
        case 3:
          formItemEle = <DatePicker {...formItemSonProps}/>;
          break;
        case 3.1:
          formItemEle = <RangePicker {...formItemSonProps}/>;
          break;
        case 5:
          formItemEle = <Button {...formItemSonProps} onClick={itemData.action.bind(this)}>
            {itemData.title}
          </Button>;
          break;
      }

      //todo 如何让属性设置成，传递了下来则有，否则没
      const key = itemData.fieldDecorator || Math.random();
      const FormItemView = type < 5 ? <FormItem
          key={key}
          {...formItemLayout4Self}
          {...formItemProps}
        >
          {getFieldDecorator(itemData.fieldDecorator, option)(formItemEle)}
        </FormItem>
        : <FormItem
          key={key}
          {...formItemLayout4Self}
        >
          {formItemEle}
        </FormItem>;
      return (
        wapperAddCol(FormItemView, span, key, layout)
      );
    });

    const btnView = wapperAddCol(<FormItem
      {...formBtnLayout}
    >
      <Button
        type="primary"
        htmlType="submit"
        disabled={this.hasErrors(getFieldsError())}
      >
        搜索
      </Button>
      <Button style={{marginLeft: 8}} onClick={this.handleReset}>
        重置
      </Button>
    </FormItem>, span, "myBtn", layout);

    return (
      <Form layout={layout} onSubmit={this.handleSearch}>
        <Row>
          {ColItems}
          {btnView}
        </Row>
      </Form>
    );
  }
}
