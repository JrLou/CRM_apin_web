import React, {Component} from 'react';
import {Icon, Card, Spin} from 'antd';
import AutoForm from './AutoForm';//FOR TEST
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  render() {
    let data = this.formData4AntdForm();
    this.reSetData(data.data);
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
  reSetData(dataArr) {
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i].type === 1.1 && (dataArr[i].dataSource = this.state.dataSource);
    }
  }

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
        this.props.onAction && this.props.onAction(dataObj);
      },                                                            //function(dataObj)                                             点击“搜索”的回调，参数为：收集到的form的dataObj
      onCancelafter: () => {

      },                                                            //function                                                      点击“重置”后的回调
      layout: "inline",                                             //string    		                    'inline'	                  表单排列的方式，  参数为：'horizontal'|'vertical'|'inline'
      formItemLayout4Each: {                                        //object                                                        每个表单控件的布局,参考antd中的formItemLayout      只有在  layout === horizontal  的时候该属性才生效
        labelCol: {style:{width: "100px"}},
        wrapperCol: {style:{width: "200px"}},
      },
      formItemStyle4Each: {                                               //object                                                        每个表单控件的样式,
        width: "350px",
        marginBottom: "30px",
        marginTop: "30px",
      },
      span: 6,                                                      //number                                                        栅格值，一行一共24个栅格，只有在  layout === horizontal  的时候该属性才生效
      data: [                                                       //*object[]                                                      生成所有表单控件的JSON格式数据
        {
          type: 1,					                                        //*number		                          1				                  表单控件的type;1=>Input  2=>Select  3=>DatePicker  3.1=>RangePicker   5=>Button
          fieldDecorator: "name",				                            //*string		                    				                        与后台数据传输的“键名”
          initialValue: "",				                                  //按需			                            ""				                仅当需要回显的时候才需要出入值
          label: "公司名称",				                                  //string|ReactNode						                                  label标签的文本
          rules: [                                                  //object[]                                                      具体参数详见：https://ant.design/components/form-cn/#校验规则
            {
              required: false,
              message: 'nothing',
            }
          ],
          placeholder: "请输入公司名",                                //string			                        "请输入"			            同html中的placeholder
          htmlType: "text",			                                    //string		                          "text"			            同input中的type,有"text"/"password"等
          style: {},            //object                                                      传入给Input/Select的css行内样式,默认宽度为220px
          prefix: <Icon type="team"/>,                              //string|ReactNode                                            带有前缀图标的 input/select
          suffix: "",                                               //string|ReactNode                                            带有后缀图标的 input
          colon: true,                                              //boolean                             true                    是否有冒号
          fieldsProps: {size: "default"},                            //object	                                                    直接传递表单控件的属性，即:<Input/Select/DatePicker/等 {...setFieldsProps}>  如和上面传递的属性相同：以此为准;具体可用参数详见antd各组件的支持属性
        }, {
          type: 1.1,
          fieldDecorator: "contactName",
          initialValue: "",
          label: "联系人姓名",
          rules: [
            {
              required: true,
              message: '请输入联系人姓名'
            }
          ],
          placeholder: "请输入联系人姓名",
          style: {},
          dataSource: [],
          fieldsProps: {
            onSelect: (value) => {
              this.loadSelectData({key: value}, (code, msg, data) => {
                if (code > 0) {
                  console.log(msg, data);
                } else {
                  console.log(msg, data);
                }
              });
            },
            onSearch: (value) => {//名称固定
              if(value !== ''){
                this.loadSearchData({value}, (code, msg, data) => {
                  if (code > 0) {
                    console.log("succ", msg);
                    this.setState({dataSource: data});
                  } else {
                    this.setState({dataSource: []});
                    console.log("err", msg);
                  }
                });
              } else {
                this.setState({dataSource: []});
              }

            },
          },
        }, {
          type: 1,
          fieldDecorator: "phone",
          initialValue: "",
          label: "手机号",
          rules: [
            {
              required: true,
              message: '请输入手机号'
            }
          ],
          placeholder: "请输入手机号",
          htmlType: "text",
          style: {},
          prefix: <Icon type="mobile"/>,
          suffix: "",
          // fieldsProps:{style:{},placeholder: "请输入年龄",},//	直接传递表单控件的属性，即:<Input/Select {...setFieldsProps}>  如和上面传递的属性相同：如都传来placeholder则以此字段值被忽略
        }, {
          type: 2,
          fieldDecorator: "checker",
          initialValue: "",
          placeholder: "请选择审核人",                              //按需			                    "请选择" 			         仅当需要回显的时候才需要出入值
          label: "审核人",
          rules: [{
            required: false,
            message: '请选择审核人'
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
          type: 3,
          fieldDecorator: "datePicker",
          initialValue: moment(new Date(), "YYYY/MM/DD").subtract(2, 'days'),
          // placeholder: "12",                                   //一般不需要
          backDataFormat:"YYYY-MM-DD 23:59:59",       //最终返回的格式。也可以设置成："YYYY-MM-DD 23:59:59" 等方式，具体可详见：https://momentjs.com/docs/#/parsing/
          label: "提交日期",
          rules: [{required: false, message: 'Please select time!'}],
          style: {},
          fieldsProps: {
            disabledDate: (currMoment) => currMoment > moment(),
            format: "YYYY/MM/DD",
            showToday: true,
            onChange: (date, dateString)=>{},
            onOk:()=>{},
          },
        }, {
          type: 3.1,
          fieldDecorator: "startTime&endTime",                         //必须有&符号，返回的也将是&符号前后的组合：如{startTime:xxx,endTime:xxx}
          initialValue: "",
          // placeholder: "12",                                   //一般不需要
          backDataFormat:"YYYY-MM-DD HH:mm:ss",       //最终返回的格式。也可以设置成："YYYY-MM-DD 23:59:59" 等方式，具体可详见：https://momentjs.com/docs/#/parsing/
          label: "提交日期",
          rules: [{type: 'array', required: false, message: 'Please select time!'}],
          style: {},
          fieldsProps: {disabledDate: (currMoment) => currMoment > moment(),},
        }, {
          type: 2,
          fieldDecorator: "asfd",
          initialValue: "",
          placeholder: "请选择审核人",
          label: "审核人",
          rules: [{
            required: false,
            message: '请选择审核人'
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
        }, {
          type: 5,
          title: "搜索",  //string	按钮名称
          style: {marginRight: 0, marginLeft: 0}, // Object 样式
          action: function (e) {
            this.handleSearch(e);//此函数名和格式固定 不能更改
          },
          formItemStyle4Self: {width: "70px"},
        }, {
          type: 5,
          title: "重置",  //string	按钮名称
          style: {marginRight: 0, marginLeft: 0}, // Object 样式
          action: function () {
            this.handleReset();//此函数名和格式固定 不能更改
          },
          formItemStyle4Self: {width: "70px"},
        }
      ]
    };
    return data;
  }
}
