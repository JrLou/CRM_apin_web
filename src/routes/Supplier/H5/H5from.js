/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Radio,
  Tabs,
  DatePicker,
  Row,
  Col,
  Table,
  AutoComplete,
} from 'antd';
import {connect, Link} from 'dva';
import css from './Flightstock.less';
import moment from 'moment';
import FlightstockPlugin from '../supplierPolicy/FlightstockPlugin.js';
import Algorithm from '../supplierPolicy/FlightstockAlgorithm.js';
import Manual from '../supplierPolicy/FlightstockManual.js';
import FlightstockShow from '../supplierPolicy/FlightstockShow.js';

const {TextArea} = Input;
const {Column,} = Table;
const confirm = Modal.confirm;
const Option = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const {RangePicker} = DatePicker;

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flightdata: {},
      flightstockData: [],//用于储蓄已添加航线
      linenubber: [],//用于存储以添加航线的值的索引
      listAir: 0, //控制航班查询有数据显示数据没有数据显示手工录入(1有数据)
      flightNumbering: '',
      flightNumsdbdsdering: true,
      visible: false,
      h5Add: props.h5Add ? props.h5Add : {details: []},
      baioshi: false,
      competencese: false,
      numbering: null,
      flightTimeWill: null,
      identification: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    let {flightdata, identification} = this.state
    this.setState({
      h5Add: nextProps.h5Add ? nextProps.h5Add : {details: []},
    })
    if (nextProps.h5Add && nextProps.h5Add.details && nextProps.h5Add.details.length > 0 && !identification) {
      let list = nextProps.h5Add.details;
      list[0].FlightNo = list[0].flight_no
      list[0].FlightDep = list[0].city_dep_name
      list[0].FlightDepAirport = list[0].airport_dep_name
      list[0].FlightDeptimePlanDate = moment(list[0].time_dep + list[0].departure_start)
      list[0].FlightArr = list[0].city_arr_name
      list[0].FlightArrAirport = list[0].airport_arr_name
      list[0].FlightArrtimePlanDate = moment(list[0].time_arr + list[0].departure_start)
      flightdata.flightTimeWill = moment(list[0].departure_start)
      this.setState({
        flightstockData: [list[0]],
        linenubber: [0],
        identification: true,
        flightdata,
        flightTimeWill: moment(list[0].departure_start)
      });
    }
    if (nextProps.h5Add && nextProps.h5Add.judgment) {
      this.props.away()
      this.props.addPost('h5Add/judgmentesd', {judgmentes: false},);
      this.setState({
        visible: false,
      });
    }
  }

  componentDidMount() {
    let data = this.state.flightdata;
    data.competenceEdit = true
    data.competence = false
    this.setState({
      flightdata: data,
    });
    this.addDate(1);
  }

  addPost(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }

  handleSubmit(e, event) {  //提交时数据格式整理，数据校验
    let _this = this
    let {flightstockData, flightdata, identification} = _this.state
    e.preventDefault();
    _this.props.form.validateFields((err, values) => {
      if (!err) {
        if (flightstockData.length == 0) {
          message.warning('请查询并选择出发航线');
          return
        }
        values.goAirLine = [flightstockData[0]]
        if (_this.props.id && !identification) {
          values.goAirLine[0].FlightDepcode = values.goAirLine[0].airport_dep_code
          values.goAirLine[0].FlightArrcode = values.goAirLine[0].airport_arr_code
          values.goAirLine[0].FlightCompany = values.goAirLine[0].flight_company
          values.goAirLine[0].FlightDep = values.goAirLine[0].city_dep_name
          values.goAirLine[0].FlightArr = values.goAirLine[0].city_arr_name
          values.goAirLine[0].FlightDeptimePlanDate = moment(values.goAirLine[0].time_dep)
          values.goAirLine[0].FlightArrtimePlanDate = moment(values.goAirLine[0].time_arr)
        } else {
          values.goAirLine[0].FlightDeptimePlanDate = moment(values.goAirLine[0].FlightDeptimePlanDate).format("YYYY-MM-DD HH:mm:ss")
          values.goAirLine[0].FlightArrtimePlanDate = moment(values.goAirLine[0].FlightArrtimePlanDate).format("YYYY-MM-DD HH:mm:ss")
        }
        values.sellPrice = values.sellPrice * 100
        values.goAirLine = JSON.stringify(values.goAirLine)
        values.cityArr = flightstockData[0].FlightArrcode
        values.cityDep = flightstockData[0].FlightDepcode
        values.startDate = values.time.format("YYYY-MM-DD")
        values.flightNumber = flightstockData[0].FlightNo + '-' + flightstockData[0].FlightNo
        this.setState({
          baioshi: true,
        });
        if (_this.props.id) {
          values.id = _this.props.id
          _this.props.addPost('h5Add/geteditAirlines', values);
        } else {
          _this.props.addPost('h5Add/getaddtit', values);
        }
        // console.log(values)
      }
    });
  }

  onChange(value, selectedOptions) {  //日期选择器结果输出
    let data = this.state.flightdata;
    data.flightTimeWill = value;
    this.setState({flightdata: data});
  }

  handleCancel(e) { //弹框关闭回调
    let data = this.state.flightdata;
    data.selected = null;
    data.entry = false;
    this.setState({
      flightdata: data,
      flightNumsdbdsdering: true,
    });
    this.props.addPost('h5Add/clearAdds', {},);
    this.props.addPost('h5Add/visiblebs', {
      visible: false,
    },);
  }

  inquiries(ole, value, event) {  //查询航线详细信息
    let {flightdata} = this.state
    if (!value) {
      message.warning('请填写要查询的航班');
      return;
    }
    if (!flightdata.flightTimeWill) {
      message.warning('请先选择出发航班日期');
      return;
    }
    this.props.addPost('h5Add/getsearchAirportesaddes', {},);
    this.setState({
      flightstockData: [],
      linenubber: [],
      identification: true,
      flightdata,
      flightNumbering: '航班号为：' + value + '的所有的航班',
      numbering: ole
    });
    setTimeout(() => {
      this.props.addPost('h5Add/addAirLine', {
        endDate: moment(flightdata.flightTimeWill).format("YYYY-MM-DD"),
        fnum: value,
        startDate: moment(flightdata.flightTimeWill).format("YYYY-MM-DD"),
        numbering: ole,
        single: true,
      },)
    }, 100)
  }

  reviewerLists() {
    let options = []
    const {h5Add} = this.state;
    if (h5Add && h5Add.accurate.data && h5Add.accurate.data.length > 0) {
      h5Add.accurate.data.map((v, k) => {
        options.push(
          <Radio value={v} key={k} className={css.selectbBox}>
            <FlightstockShow accurate={v} routeSelection={this.routeSelection.bind(this)}/>
          </Radio>
        )
      })
      return options
    }
  }

  routeSelection(e) { //查询航线结果选中
    let {h5Add, flightstockData, linenubber,} = this.state
    flightstockData[h5Add.numbering] = e.target.value
    linenubber[h5Add.numbering] = h5Add.numbering
    this.setState({
      flightstockData,
      linenubber,
    });
  }

  mokecopen(ole) { //手动录入成功回调函数
    let {linenubber, flightdata, flightstockData, h5Add, numbering, code} = this.state
    ole.FlightDeptimePlanDate = moment(flightdata.flightTimeWill.format('YYYY-MM-DD') + " " + ole.FlightDeptimePlanDate + ':00')
    ole.FlightArrtimePlanDate = moment(flightdata.flightTimeWill.format('YYYY-MM-DD') + " " + ole.FlightArrtimePlanDate + ':00')
    h5Add.visible = false;
    flightstockData[numbering] = ole
    linenubber[numbering] = numbering
    this.setState({
      h5Add,
      flightstockData,
      linenubber,
    });
  }

  handleOk() { //弹窗确定操作回调
    let {h5Add, flightdata, flightstockData} = this.state;
    switch (h5Add.ok) {
      case "选择航班":
        if (!flightstockData[h5Add.numbering].FlightNo) {
          message.warning('请选择航班');
          return
        } else {
          flightdata.selected = null;
          this.setState({
            flightdata: flightdata
          });
          this.props.addPost('h5Add/visiblebs', {
            visible: false,
          },);
        }
        break;
      case "手工录入":
        flightdata.entry = true;
        flightdata.flightNumsdbdsdering = false;
        flightdata.ok = "录入";
        this.setState({
          flightdata: flightdata,
          flightNumsdbdsdering: false,
          flightNumbering: "手工录入航班"
        });
        break;
      case "录入":
        flightdata.flightNumsdbdsdering = false;
        break;
    }
  }

  showcasing(ole) {
    let data = this.state.flightstockData[ole];
    return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
      <div style={{width: '100%'}}>
        <FlightstockPlugin data={data} h5={true} kyes={ole}/>
      </div>
    </Col>
  }

  weekSelect(week, ole) {
    let data = this.state.flightdata;
    this.setState({
      flightdata: data,
    });
  }

  addDate(ole, add) {
    let _this = this;
    const {form} = _this.props;
    switch (ole) {
      case 1:
        form.setFieldsValue({keys: [0]});
        break;
      case 2:
        form.setFieldsValue({keys: [0, 1]});
        break;
    }
  }

  validatores(rule, value, callback) {
    if (value < 51) {
      callback('最小值为51')
    }
    callback()
  }

  render() {
    const {getFieldDecorator, getFieldProps, getFieldsValue, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const {h5Add} = this.state
    const requiredText = "请填写此选项"
    if (this.props.id && h5Add && h5Add.details.length > 0) {
      for (let i = 0; i < h5Add.details.length; i++) {
        getFieldDecorator('names-' + i, {initialValue: h5Add.details[i].flight_no});
      }
    }
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Col key={k} span={24}>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '10px'}}
            label={(k == 1) ? '添加返程航线' : '添加航线'}
          >
            {getFieldDecorator(`names-${k}`, {
              rules: [{
                required: true,
                message: requiredText,
              },
                {
                  max: 6,
                  message: "航班号最长六位"
                }
              ],
            })(
              <Search
                placeholder="请填写航班号"
                style={{width: '450px'}}
                onSearch={this.inquiries.bind(this, k)}
                enterButton
              />
            )}
            {this.state.linenubber.indexOf(k) != -1 && this.showcasing(k)}
          </FormItem>
        </Col>
      )
    });
    return (
      <div className={css.AgenciesView_box}>
        <Tabs type="card">
          <TabPane tab="航班政策信息" key="1">
            <Form layout={'horizontal'} onSubmit={this.handleSubmit.bind(this)}>
              <div className={css.AgenciesView_box_list}>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="航班周期"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('time', {
                        rules: [{required: true, message: requiredText,}],
                        initialValue: this.state.flightTimeWill
                      })
                      (<DatePicker style={{width: '450px'}}
                                   disabledDate={(current) => {
                                     return current && current < moment().endOf('day');
                                   }}
                                   onChange={this.onChange.bind(this)}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    {formItems}
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="含税价"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('sellPrice', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "只允许输入最长6位自然数"},
                          {
                            validator: this.validatores.bind(this),

                          }],
                        initialValue: h5Add.details.length > 0 ? (parseInt(h5Add.details[0].sell_price) / 100).toString() : '',
                      })
                      (< Input placeholder="请填写"
                               style={{width: '410px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="折扣"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('discount', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {
                          pattern: /^[1-9](\.\d{1})?$|^(10)(\.0)?$|^[0](\.[1-9]{1}){1}$/,
                          message: "最多输入一位小数，范围从0.1至10折"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: h5Add.details.length > 0 ? h5Add.details[0].discount : '',
                      })
                      (< Input placeholder="请填写"
                               style={{width: '450px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <div style={{paddingLeft: '12%'}}>
                      <Button type="primary"
                              disabled={false}
                              htmlType="submit"
                              size="large"
                              style={{height: "30px", marginRight: "10px"}}>保存</Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </TabPane>
        </Tabs>
        {h5Add.visible &&
        < div className={css.shoudes}>
          <Modal
            className={css.popModal}
            title={this.state.flightNumbering}
            visible={h5Add.visible}
            onCancel={this.handleCancel.bind(this)}
            footer={null}
          >
            {h5Add.accurate && h5Add.accurate.data &&
            <RadioGroup onChange={this.routeSelection.bind(this)}>
              {this.reviewerLists()}
            </RadioGroup>}
            {!h5Add.accurate.data && !this.state.flightdata.entry &&
            <h3 style={{textAlign: "center", marginBottom: '10px'}}>没有该航班信息</h3>}
            {this.state.flightdata.entry && <Manual h5={true} open={this.mokecopen.bind(this)}/>}
            {this.state.flightNumsdbdsdering &&
            <Button style={{marginLeft: '41%'}} type="primary"
                    onClick={this.handleOk.bind(this)}>{h5Add.ok}</Button>}

          </Modal>
        </div>
        }
      </div>
    )
  }
}

module.exports = AddForm;
