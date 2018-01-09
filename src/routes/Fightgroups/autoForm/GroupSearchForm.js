import React, {Component} from 'react';
import {Icon, Card, Spin} from 'antd';
import AutoForm from './AutoForm';//FOR TEST
import moment from 'moment';


export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceFromAddr: [],
      dataSourceToAddr: [],
      dataSourceGroupOrderId: [],
    };
  }

  render() {
    let data = this.formData4AntdForm();
    // this.reSetData(data.data);
    return (
      <AutoForm
        data={data}
      />
    );
  }

  /**
   * 设置某些属性等于状态机的属性
   * @param dataArr
   */

  loadSearchData(param, cb) {
    //mock AJAX
    setTimeout(() => {
      let code = Math.random() - 0.1;
      let data = [];
      if (code > 0) {
        for (let i = 0; i < Math.random() * 10; i++) {
          data.push(param.value + "" + Math.random());
        }
      }
      cb(code, code > 0 ? "成功" : "失败", data);
    }, Math.random() * 1000);
  }

  loadSelectData(param, cb) {
    //mock AJAX
    setTimeout(() => {
      const code = Math.random() - 0.5;
      let data = [];
      if (code > 0) {
        for (let i = 0; i < Math.random() * 10; i++) {
          data.push(i);
        }
      }
      cb(code, code > 0 ? "succ" : "err", data);
    }, Math.random() * 1000);
  }

  formData4AntdForm() {
    let data = {
      /*************************************************************  类型（*前缀为必填项）*************  默认值  *******************  说明  ***/
      onSearch: dataObj => {
        //todo antd@2.0 之后，时间类组件的 value 改为 moment 类型，所以在提交前需要预处理。
        this.props.onSearch && this.props.onSearch(dataObj);
      },                                                            //function(dataObj)                                             点击“搜索”的回调，参数为：收集到的form的dataObj
      onCancelAfter: dataObj => {
        this.props.onCancelAfter && this.props.onCancelAfter(dataObj);
      },                                                            //function                                                      点击“重置”后的回调
      layout: "inline",                                             //string    		                    'inline'	                  表单排列的方式，  参数为：'horizontal'|'vertical'|'inline'
      formItemLayout4Each: {                                        //object                                                        每个表单控件的布局,参考antd中的formItemLayout      只有在  layout === horizontal  的时候该属性才生效
        // labelCol: {style: {width: "100px"}},
        // wrapperCol: {style: {width: "200px"}},
      },
      formItemStyle4Each: {                                               //object                                                        每个表单控件的样式,
        width: "350px",
        marginBottom: "20px",
      },
      span: 6,                                                      //number                                                        栅格值，一行一共24个栅格，只有在  layout === horizontal  的时候该属性才生效
      data: [                                                       //*object[]                                                      生成所有表单控件的JSON格式数据
        {
          type: 1,					                                        //*number		                          1				                  表单控件的type;1=>Input  2=>Select  3=>DatePicker  3.1=>RangePicker   5=>Button
          fieldDecorator: "name",				                            //*string		                    				                        与后台数据传输的“键名”
          initialValue: "",				                                  //按需			                            ""				                仅当需要回显的时候才需要出入值
          label: "出发城市",				                                  //string|ReactNode						                                  label标签的文本
          rules: [                                                  //object[]                                                      具体参数详见：https://ant.design/components/form-cn/#校验规则
            {
              required: false,
              message: 'nothing',
            }
          ],
          placeholder: "请输入出发城市",                                //string			                        "请输入"			            同html中的placeholder
          htmlType: "text",			                                    //string		                          "text"			            同input中的type,有"text"/"password"等
          style: {},            //object                                                      传入给Input/Select的css行内样式,默认宽度为220px
          prefix: <Icon type="team"/>,                              //string|ReactNode                                            带有前缀图标的 input/select
          suffix: "",                                               //string|ReactNode                                            带有后缀图标的 input
          colon: true,                                              //boolean                             true                    是否有冒号
          fieldsProps: {size: "default"},                            //object	                                                    直接传递表单控件的属性，即:<Input/Select/DatePicker/等 {...setFieldsProps}>  如和上面传递的属性相同：以此为准;具体可用参数详见antd各组件的支持属性
        }, {
          type: 1,
          fieldDecorator: "contactName",
          initialValue: "",
          label: "目的城市",
          rules: [
            {
              required: false,
              message: '请输入目的城市'
            }
          ],
          placeholder: "请输入目的城市",
          style: {},
        }, {
          type: 2,
          fieldDecorator: "checker",
          initialValue: "A",
          // placeholder: "拼团状态",                              //按需			                    "请选择" 			         仅当需要回显的时候才需要出入值

          label: "拼团状态",
          rules: [{
            required: false,
            message: '请选择拼团状态'
          }
          ],
          style: {minWidth: "100px"},
          options: [                                              //*object[]                                                      select下的option
            {
              txt: "A",                                           //*string                                                         option显示的文字
              value: "A",                                         //*按需                                                            select的value
            }, {
              txt: "B",
              value: "B"
            }, {
              txt: "C",
              value: "C"
            }, {
              txt: "D",
              value: "D"
            }, {
              txt: "E",
              value: "E"
            }
          ],
        }, {
          type: 1,
          fieldDecorator: "asfd1",
          initialValue: "",
          label: "拼团单号",
          rules: [
            {
              required: false,
              message: '请输入拼团单号'
            }
          ],
          placeholder: "请输入拼团单号",
          style: {},
        }, {
          type: 2,
          fieldDecorator: "asfd",
          initialValue: "",
          placeholder: "请选择拼团类型",
          label: "拼团类型",
          rules: [{
            required: false,
            message: '请选择拼团类型'
          }],
          style: {minWidth: "100px"},
          options: [                                            //object[]                                                      select下的option
            {
              txt: "A",                                         //string                                                         option显示的文字
              value: "A",                                       //按需                                                            select的value
            }, {
              txt: "B",
              value: "B"
            }, {
              txt: "C",
              value: "C"
            }, {
              txt: "D",
              value: "D"
            }, {
              txt: "E",
              value: "E"
            }
          ],
        },
      ]
    };
    return data;
  }
}
