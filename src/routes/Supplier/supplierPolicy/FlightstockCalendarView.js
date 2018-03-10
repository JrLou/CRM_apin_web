/**
 *  李斯奇 on 16/10/25.
 *  （首页日历）.
 */
import React, {Component} from 'react';
import {Calendar, Button, Icon, Modal, Row, Col, Form, Input, Radio, message, Upload} from 'antd';
import moment from 'moment';
import Masking from './FlightMasking.js';
import css from './Flightstock.less';
import md5 from 'md5';
import {connect, Link} from 'dva';
import fetch from 'dva/fetch';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
import AllocationCalendar from './AllocationCalendar/MultipleSelectCalendar.js';

moment.locale('zh-cn');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(state => ({
  flightstockView: state.flightstockView,
}))
class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelect: moment('2017-1'),
      visible: false,
      rightType: 'modifyPrice',   //'modifyStock'   'modifyClearTime'
      currenMonthStocks: new Array(31).fill(0),
      canPick: [],
      selectedTips: [],
      datesArr: [],
      flightstockView: {},
      judgment: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flightstockView: nextProps.flightstockView ? nextProps.flightstockView : {}
    });
    if (nextProps.flightstockView && nextProps.flightstockView.ajaxJudgment) {
      this.props.addPost('flightstockView/ajaxJu', {ajaxJudgment: false},)
      this.dateGetReturn();
      this.form.resetFields()
      this.setState({
        visible: false,
      });
    }
  }

  componentDidMount() {
    this.dateGet();
    // 库存
    const dateStart = moment(this.props.listdata.departure_start, "YYYY-MM-DD").format('YYYY/MM/DD');
    let [year, month, day] = [new Date(dateStart).getFullYear(), new Date(dateStart).getMonth(), new Date(dateStart).getDate()]
    // this.dateDiff("2018-03-10")
    // console.log('dddddddd')
    let s1 = '2018-03-6';
    s1 = new Date(s1.replace(/-/g, "/"));
    let s2 = new Date();
    let days = s2.getTime() - s1.getTime();
    let time = parseInt((days / (1000 * 60 * 60 * 24)));
    console.log(time)
  }

  loadData(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }
  dateGet() {  //初始化获取要展示的日期
    let dates = moment(new Date()).format("YYYY-MM");
    let b = new Date().getTime();
    let a = moment(this.props.listdata.departure_start, "YYYY-MM").format('x');
    let c = moment(this.props.listdata.departure_end, "YYYY-MM").format('x');
    if (b > a && b < c) {
      this.loadData('flightstockView/getpriceAirline', {
        date: moment(this.props.listdata.departure_start).format('YYYY-MM'),
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(this.props.listdata.departure_start),
      })

    } else {
      this.loadData('flightstockView/getpriceAirline', {
        date: dates,
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(dates),
      })
    }
  }

  dateGetReturn() {
    this.loadData('flightstockView/getpriceAirline', {
      date: moment(this.state.dateSelect).format('YYYY-MM'),
      id: this.props.listdata.id,
    },);
  }

  getListData(value) {
    const {flightstockView: {airline}} = this.props;
    let listData;
    if (airline.length > 0) {
      for (let i = 0; i < airline.length; i++) {
        if (moment(airline[i].flight_date).format("YYYY-MM-DD") == value.format("YYYY-MM-DD")) {
          listData = {
            list: [
              {
                type: 'warning',
                content: '结算价:',
                price: parseInt(airline[i].settlement_price) / 100 + "元(成)" + "/" + parseInt(airline[i].settlement_price_child) / 100 + "元(儿)"

              },
              {
                type: 'errors',
                content: '销售价:',
                price: parseInt(airline[i].sell_price) / 100 + "元(成)" + "/" + parseInt(airline[i].sell_price_child) / 100 + "元(儿)"
              },
              {
                type: 'error',
                content: '销售价(团):',
                price: parseInt(airline[i].sell_price_group) / 100 + "元(成)" + "/" + parseInt(airline[i].sell_price_group_child) / 100 + "元(儿)"

              },
              {
                type: 'normal',
                content: '库存(已售/总):',
                price: airline[i].sale_count + '/' + airline[i].seat_count
              },
              {
                type: 'errorss',
                content: '清位时间',
                price: moment(airline[i].clear_date).format("YYYY-MM-DD")
              },
            ]

          };
        }
      }
    }
    return listData || {
      tishi: false, list: [
        {content: '暂无班期'},
      ], tishis: 0,
    };
  }

  addPost(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }

  // 封装批量修改
  modifyData(values, myValidate) {
    let {flightstockView, judgment} = this.state;
    let url = ''
    if (!this.state.datesArr || this.state.datesArr.length < 1) {
      message.warning('请选择批量修改的日期')
      return
    }
    if (myValidate) {
      if (!this.state.recycleDay) {
        this.setState({
          inputErr: true
        })
        return
      }
    }
    switch (judgment) {
      case 0:
        url = 'flightstockView/getmodifyPricees'
        break;
      case 1:
        url = 'flightstockView/getmodifyInventoryes'
        break;
      case 2:
        url = 'flightstockView/getgetmodifyDayses'
        break;
      default:
        break;
    }
    this.addPost("flightstockView/ajaxJu", {ajaxJudgment: false})
    this.addPost(url, Object.assign({
      dateString: this.state.datesArr.join(","),
      uuid: this.props.listdata.id
    }, values))
  }

  pamdiam() {
    let _this = this
    let {flightstockView} = _this.state
    if (flightstockView && flightstockView.ajaxJudgment) {
      message.success('操作成功')
      // 刷新日历
      _this.dateGetReturn();
      // 清空
      _this.setState({
        visible: false,
      })
      // 清空表单
      _this.form.resetFields()
    }
  }

  ObtainloadData() {
    this.loadData("/apinAirline/calendarInfo", {
      airlineId: this.props.post.id,
      endDate: moment(moment(this.state.dateSelect).format("YYYY-MM")).endOf('month').format("YYYY-MM-DD"),
      startDate: moment(this.state.dateSelect).format("YYYY-MM") + "-01",
    });
  }

  dateCellRender(value) {
    const listData = this.getListData(value);
    //初始化,记录,被选中
    const key = md5(value.toString());
    if (!this.maskingMap) {
      this.maskingMap = new Map();
    }
    return (
      <Masking
        in={(close) => {
          //告诉兄弟们,关闭吧
          for (let key2 of this.maskingMap.keys()) {
            if (key != key2) {
              let action = this.maskingMap.get(key2);
              if (action && typeof (action) == "function") {
                action();
              }
            }
          }
          this.maskingMap.clear();
          this.maskingMap.set(key, close)
        }}
        listData={listData}
        loadData={this.ObtainloadData.bind(this)}/>
    );
  }

  onSelect(value) {
    this.setState({
      dateSelect: value,
    });
    this.loadData('flightstockView/getpriceAirline', {
      date: moment(value).format('YYYY-MM'),
      id: this.props.listdata.id,
    },);
  }

  // 通过参数控制多个modal显
  changeModal(rightType) {
    let {judgment} = this.state
    switch (rightType) {
      case 'modifyPrice':
        this.modalTitle = "批量设置团期价格"
        judgment = 0
        break;
      case 'modifyStock':
        this.modalTitle = "批量设置团期库存"
        judgment = 1
        break;
      case 'modifyClearTime':
        this.modalTitle = "批量设置清位时间"
        judgment = 2
        break;
      case 'addStage':
        this.modalTitle = "新增团期报价"
        judgment = 3
        break;
      default:
        break;
    }
    this.setState({
      rightType: rightType,
      visible: true,
      selectedTips: [],
      datesArr: [],
      judgment: judgment
    })
    // 如果只是关闭叉叉
    this.outter && this.outter.resetCalendar()
  }

  // 通过参数控制多个modal显
  showModal(isShow = false) {
    let _this = this
    _this.form.resetFields()
    _this.setState({
      visible: isShow,
    })
  }

  // 生成页面显示的已选信息
  createSelectedText(pickInfo) {
    let textArr = []
    // let wholeStock = []
    let datesArr = []
    // 年
    for (var key in pickInfo) {
      if (pickInfo.hasOwnProperty(key)) {
        // 月
        for (var _key in pickInfo[key]) {
          if (pickInfo[key].hasOwnProperty(_key)) {
            let sortedDays = pickInfo[key][_key].days.sort((a, b) => {
              return a - b
            })
            let newDays = sortedDays.map((v, k) => {
              datesArr.push(
                moment(key + '-' + _key + '-' + v, "YYYY-MM-DD").format("YYYY-MM-DD")
              )
              return v + '日'
            })
            newDays.length > 0 && textArr.push(
              <div key={key + _key}
                   className={css.tip}>{key + '年' + _key + '月：' + newDays.join(',')}</div>
            )
            // wholeStock = wholeStock.concat(pickInfo[key][_key].stocks)
          }
        }

      }
    }
    // 获取库存最小值
    // let _minStock = wholeStock.sort((a, b) => { return a - b })[0]

    this.setState({
      selectedTips: textArr,
      // minStock: _minStock ? _minStock : 0,
      datesArr: datesArr
    })
  }

  showPickInfo(pickInfo) {
    this.createSelectedText(pickInfo)
    this.setState({
      selectedStocks: pickInfo
    })
  }

  visiblees() {
    let _this = this
    _this.setState({
      showImportModal: false
    })
  }

  rightContent() {
    //  'modifyPrice',   //'modifyStock'   'modifyClearTime'
    switch (this.state.rightType) {
      case 'modifyPrice':

        return (<div className={css.part}>
          <div className={css.title}>批量编辑团期报价</div>
          <WrappedModifyPriceFrom
            ref={form => this.form = form}
            row={'modifyPrice'}
            dateArr={this.state.datesArr}
            showModal={this.showModal.bind(this)}
            modifyData={this.modifyData.bind(this)}
          />
        </div>)

        break;
      case 'addStage':

        return (<div className={css.part}>
          <div className={css.title}>批量编辑团期报价</div>
          <WrappedModifyPriceFrom
            ref={form => this.form = form}
            row={'addStage'}
            dateArr={this.state.datesArr}
            showModal={this.showModal.bind(this)}
            modifyData={this.modifyData.bind(this)}/>
        </div>)
        break;
      case 'modifyStock':

        return (<div className={css.part}>
          <div className={css.title}>批量修改团期库存</div>
          <WrappedModifyPriceFrom
            ref={form => this.form = form}
            row={'modifyStock'}
            dateArr={this.state.datesArr}
            showModal={this.showModal.bind(this)}
            modifyData={this.modifyData.bind(this)}
          />
        </div>)
        break;
      case 'modifyClearTime':
        return (<div className={css.part}>
          <div className={css.title}>批量设置清位时间</div>
          <WrappedModifyPriceFrom
            ref={form => this.form = form}
            row={'modifyClearTime'}
            dateArr={this.state.datesArr}
            showModal={this.showModal.bind(this)}
            modifyData={this.modifyData.bind(this)}
          />
        </div>)
        break;
      default:
        return null
        break;
    }
  }

  showImportModal(value) {
    this.setState({
      showImportModal: value
    })
  }

  upLoadFile(values) {
    HttpTool.post(APILXF.api_airlines_import,
      (code, msg, json, option) => {
        // message.warning(msg);
        if (json) {
          let msArr = json.map((v, k) => {
            return moment(v, 'YYYY-MM-DD').format('x')
          })
          this.setState({
            canPick: msArr
          })
        }
      }, (code, msg, json, option) => {
        message.warning(msg);
      }, values, 'FORM'
    )
  }

  render() {
    // 库存
    const {flightstockView: {airline}} = this.props;
    let [year, month, day] = [
      +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('YYYY'),
      +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('MM') - 1,
      +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('DD')
    ]
    let canPick = airline.map((v, k) => {
      return v.flight_date;
    })
    return (
      <div className={css.container}>
        {/*<div className={css.btnBox}>*/}
          {/*<Button onClick={this.showImportModal.bind(this, true)}>价格批量导入</Button>*/}
          {/*/!* <Button onClick={this.changeModal.bind(this, "addStage")}>新增团期报价</Button> *!/*/}
          {/*<Button onClick={this.changeModal.bind(this, "modifyPrice")}>修改价格</Button>*/}
          {/*<Button onClick={this.changeModal.bind(this, "modifyStock")}>修改库存</Button>*/}
          {/*<Button onClick={this.changeModal.bind(this, "modifyClearTime")}>修改清位时间</Button>*/}
        {/*</div>*/}
        <Calendar
          value={this.state.dateSelect}
          dateCellRender={this.dateCellRender.bind(this)}
          onSelect={this.onSelect.bind(this)} onPanelChange={this.onSelect.bind(this)}
        />
        {/* 修改价格的modal */}
        <Modal
          title={this.modalTitle}
          style={{top: 300}}
          visible={this.state.visible}
          onCancel={this.showModal.bind(this, false)}
          footer={null}
          width={900}
        >
          <Row style={{minHeight: '380px', padding: '15px'}}>
            <Col span={11}>
              <div className={css.part} style={{marginRight: '20px'}}>
                <div className={css.title}>选择团期</div>
                <AllocationCalendar
                  ref={calendar => this.outter = calendar}
                  year={year}
                  month={month}
                  day={day}
                  currenMonthStocks={this.state.currenMonthStocks}
                  canPick={canPick}
                  placeholder={this.state.selectedTips.length > 0 ? '已选择' : '选择分配时间'}
                  upPickInfo={this.showPickInfo.bind(this)}
                />
                <div className={css.tipBox}>
                  <div>已选择：</div>
                  {this.state.selectedTips.length > 0 ? this.state.selectedTips : "请选择需要批量修改的日期"}
                </div>
              </div>
            </Col>
            <Col span={13}>
              {this.rightContent()}
            </Col>
          </Row>
        </Modal>
        {/* 批量导入的modal */}
        <Modal
          title={'价格批量导入'}
          style={{top: 300}}
          visible={this.state.showImportModal}
          onCancel={this.showImportModal.bind(this, false)}
          footer={null}
          width={800}
        >
          <WrappedBulkImportForm
            dateGetReturn={this.dateGetReturn.bind(this)}
            showImportModal={this.showImportModal.bind(this)}
            listdata={this.props.listdata}
            airlineId={this.props.listdata.id}
            addPost={this.addPost.bind(this)}
            upFile={this.upLoadFile.bind(this)}
            visiblees={this.visiblees.bind(this)}

          />

        </Modal>
      </div>
    );
  }
}

module.exports = page;
export default page;

// 修改价格表单
class ModifyPriceFrom extends Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // this.props.dateArr
        values.sellPrice = parseInt(values.sellPrice) * 100;
        values.settlementPrice = parseInt(values.settlementPrice) * 100;
        this.props.modifyData(values)

      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        {/* <hr className={css.hr} />  addstage modifyStock modifyClearTime modifyPrice */}
        {this.props.row == 'addStage' || this.props.row == 'modifyPrice' ?
          <div>
            <FormItem
              label="销售价"
              labelCol={{span: 6}}
              wrapperCol={{span: 9}}
            >
              {getFieldDecorator('sellPrice', {
                rules: [{required: true, message: '必填'}, {
                  pattern: /^[1-9]\d{0,4}$/,
                  message: "请输入小于6位的正整数"
                }],
              })(
                <Input/>
              )}
            </FormItem>
            {/* <hr className={css.hr} /> */}
            <FormItem
              label="结算价"
              labelCol={{span: 6}}
              wrapperCol={{span: 9}}
            >
              {getFieldDecorator('settlementPrice', {
                rules: [{required: true, message: '必填'}, {
                  pattern: /^[1-9]\d{0,4}$/,
                  message: "请输入小于6位的正整数"
                }],
              })(
                <Input/>
              )}
            </FormItem>
          </div>
          : null}

        {this.props.row == 'addStage' || this.props.row == 'modifyStock' ?

          <FormItem
            label="库存类型"
            labelCol={{span: 6}}
            wrapperCol={{span: 15}}
          >
            {getFieldDecorator('flightType', {
              rules: [{required: true, message: '必填'}],
            })(
              <RadioGroup>
                <Radio value={1}>硬切</Radio>
                <Radio value={2}>代销</Radio>
                {/*<Radio value={0}>不限库存</Radio>*/}
              </RadioGroup>
            )}
          </FormItem>
          : null}
        {this.props.row == 'modifyStock' ?
          <FormItem
            label="库存数量"
            labelCol={{span: 6}}
            wrapperCol={{span: 15}}
          >
            {getFieldDecorator('seatCount', {
              rules: [{required: true, message: '必填'}, {
                pattern: /^[0-9]\d{0,4}$/,
                message: "请输入小于6位的整数"
              }],
            })(
              <Input/>
            )}
          </FormItem>
          : null}
        {this.props.row == 'addStage' ?
          <FormItem
            label="首次入库数"
            labelCol={{span: 6}}
            wrapperCol={{span: 9}}
          >
            {getFieldDecorator('storeCount', {
              rules: [{required: true, message: '必填'}, {
                pattern: /^[1-9]\d{0,4}$/,
                message: "请输入小于6位的正整数"
              }],
            })(
              <Input/>
            )}
          </FormItem>
          : null}
        {this.props.row == 'addStage' || this.props.row == 'modifyClearTime' ?
          <FormItem
            label="自动清位时间"
            labelCol={{span: 6}}
            wrapperCol={{span: 9}}
          >
            {getFieldDecorator('clearDate', {
              rules: [{required: true, message: '必填'}, {
                pattern: /^[1-9]\d{0,4}$/,
                message: "请输入小于6位的正整数"
              }],
            })(
              <Input style={{width: '200px'}} addonBefore={'于'} addonAfter={'天前清位'}/>
            )}
          </FormItem>
          : null}
        <FormItem
          wrapperCol={{span: 8, offset: 1}}
        >
          <Button type="primary" htmlType="submit">
            <Icon type="save"/>保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedModifyPriceFrom = Form.create()(ModifyPriceFrom);

// 批量修改的表单
class BulkImportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //     if (!err) {
    // const { fileList } = this.state;
    // const formData = new FormData();
    // formData.append('file', fileList[0], fileList[0].name);
    // formData.append('airlineId', this.props.airlineId);
    // // You can use any AJAX library you like
    // this.props.upFile(formData)

    // 清空上次输入
    // this.props.form.resetFields()
    this.props.showImportModal(false)
    // }
    // });
  }

  beforeUploadGroup(obj) {
    if (obj) {
      let fileURL = obj.file.name.split('.');
      if (fileURL[fileURL.length - 1] !== 'xlsx') {
        message.error('您上传的不是Excel，请重新上传');
        this.setState({
          fileList: []
        });
        return;
      }
      if (obj.file.size > 4096000) {
        message.error('上传文件不能大于4MB，请重新导入');
        this.setState({
          fileList: []
        });
        return;

      }
      if (obj.file.status === 'error') {
        message.error('导入失败')
        return;
        this.setState({
          fileList: []
        })
      }
      console.log(obj.file.response);

      if (obj.file.response && obj.file.response.code >= 1) {
        message.success('操作成功')
        this.props.dateGetReturn();
        this.props.visiblees();
        console.log(obj)
        console.log(this.props)
      }
      this.setState({
        fileList: obj.fileList
      })

    }
  }

  beforeUpload(file) {
    const isJPG = file.type === 'xlsx/xls';
    // if (!isJPG) {
    //   message.error('您上传的不是Excel，请重新上传!');
    // }
    console.log(file)
    const isLt2M = file.size < 4096000;
    if (file.size > 4096000) {
      message.error('上传文件不能大于4MB，请重新导入!');
    }
    return isLt2M;
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 8},
    };
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
        {/* <hr className={css.hr} /> */}
        <Row>
          <Col span={12}>
            <FormItem
              label="机票资源编号"
              {...formItemLayout}
            >
              {getFieldDecorator('resourceIndex', {
                initialValue: this.props.listdata && this.props.listdata.is_invalid
              })
              (< Input className={css.notEdit} placeholder="" readOnly
                       style={{width: '150px', marginRight: '10px'}}/>)}

            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="航班号"
              {...formItemLayout}
            >
              {getFieldDecorator('flightNo', {
                initialValue: this.props.listdata && this.props.listdata.flight_no
              })
              (< Input className={css.notEdit} placeholder="" readOnly
                       style={{width: '150px', marginRight: '10px'}}/>)}
            </FormItem>

          </Col>
        </Row>
        <FormItem
          label="导入本地策略 "
          {...{
            labelCol: {span: 4},
            wrapperCol: {span: 8},
          }}
        >
          {getFieldDecorator('file', {
            rules: [{required: true, message: '请选择需要上传的文件'}]
          })
          (
            <Upload
              action={window.location.origin + "/api/resource/importFile"}
              headers={{
                authorization: 'authorization-text',
              }}
              data={{'uuid': this.props.listdata.id}}
              name={'File'}
              beforeUpload={this.beforeUpload.bind(this)}
              accept='.xlsx,.xls'
              fileList={this.state.fileList}
              onChange={this.beforeUploadGroup.bind(this)}
            >
              <Button>导入</Button>
            </Upload>
          )
          }
          <span>文件大小不能超过4MB，<a
            href="/api/resource/exportTemp">模板下载</a></span>
        </FormItem>
        <FormItem
          wrapperCol={{span: 8, offset: 1}}
        >
          {/*<Button type="primary" htmlType="submit">*/}
          {/*确认*/}
          {/*</Button>*/}
        </FormItem>
      </Form>
    );
  }
}

const WrappedBulkImportForm = Form.create()(BulkImportForm);
