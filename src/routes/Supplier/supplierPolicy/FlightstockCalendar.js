/**
 *  李斯奇 on 16/10/25.
 *  （首页日历）.
 */
import React, {Component} from 'react';
import {Calendar, Button, Icon, Modal, Row, Col, Form, Input, Radio, message, Upload} from 'antd';
import moment from 'moment';
// import HttpTool from '../../../http/HttpTool.js';
// import APILXF from '../../../http/APILXF.js';
import Masking from './FlightMasking.js';
import css from './Flightstock.less';
import md5 from 'md5';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
import AllocationCalendar from './AllocationCalendar/MultipleSelectCalendar.js';

moment.locale('zh-cn');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateSelect: moment('2017-1'),
            nowadays: '',
            date: [],
            authoritya: [],
            authorityb: this.props.post || 1,
            visible: false,
            rightType: 'modifyPrice',   //'modifyStock'   'modifyClearTime'
            currenMonthStocks: new Array(31).fill(0),
            canPick: [],
            selectedTips: [],
            datesArr: [],
        }
    }

    componentDidMount() {
        this.dateGet();
        // 库存
        const dateStart = moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('YYYY/MM/DD');
        let [year, month, day] = [new Date(dateStart).getFullYear(), new Date(dateStart).getMonth(), new Date(dateStart).getDate()]
        // this.getAlllowDays()
    }

    loadData(url, param, mark) {
        HttpTool.post(url,
            (code, msg, json, option) => {
                // message.warning(msg);
                this.setState({
                    date: json.contentList,
                });
            }, (code, msg, json, option) => {
                // message.warning(msg);
            }, param)
    }

    dateGet() {  //初始化获取要展示的日期
        let dates = moment(new Date()).format("YYYY-MM");
        let a = moment(this.props.date[0], "YYYY-MM-DD").format('x');
        let b = new Date().getTime();
        let c = moment(this.props.date[1], "YYYY-MM-DD").format('x');
        if (b > a && b < c) {
            this.setState({
                dateSelect: moment(dates),
            })
            this.loadData(APILXF.api_detail, {
                airlineId: this.props.listdata.id,
                accountId: this.props.listdata.accountId,
                endDate: moment(dates).endOf('month').format("YYYY-MM-DD"),
                startDate: moment(dates).format("YYYY-MM") + "-01",
            });

        } else {
            this.setState({
                dateSelect: moment(this.props.date[0]),
            })
            this.loadData(APILXF.api_detail, {
                airlineId: this.props.listdata.id,
                accountId: this.props.listdata.accountId,
                endDate: moment(this.props.date[0]).endOf('month').format("YYYY-MM-DD"),
                startDate: moment(this.props.date[0]).format("YYYY-MM") + "-01",
            });
        }
    }

    dateGetReturn() {
        this.loadData(APILXF.api_detail, {
            airlineId: this.props.listdata.id,
            accountId: this.props.listdata.accountId,
            endDate: this.state.dateSelect.endOf('month').format("YYYY-MM-DD"),
            startDate: this.state.dateSelect.format("YYYY-MM") + "-01",
        });
    }

    getListData(value) {
        let listData;
        if (this.state.date) {
            for (let i = 0; i < this.state.date.length; i++) {
                if (this.state.date[i].departDate == value.format("YYYY-MM-DD")) {
                    let a = new Date().getTime();
                    let b = moment(this.state.date[i].recoveryDate.split(' ')[0], "YYYY-MM-DD").format('x');
                    console.log(this.state.date[i].recoveryDate.split(' ')[0]);
                    console.log(this.state.date[i].recoveryDate.split(' ')[0]);
                    listData = {
                        tishi: this.state.date[i].alertStatus,
                        tishis: 1,
                        date: this.state.date[i].departDate,
                        unallocated: this.state.date[i].unallocated,
                        ifAllocated: this.state.date[i].ifAllocated,
                        childPrice: this.state.date[i].childPrice,
                        Expired: this.state.date[i].expire,
                        qinwei: a >= b ? false : true,
                        list: [
                            {
                                type: 'warning',
                                content: '成人/儿童价:',
                                price: this.state.date[i].adultPrice ? this.state.date[i].adultPrice + '/' + this.state.date[i].childPrice : 0
                            },
                            {
                                type: 'error',
                                content: '库存(已售/总):',
                                price: this.state.date[i].sold != null ? this.state.date[i].sold + '/' + this.state.date[i].seatCount : 0
                            },
                            {
                                type: 'normal',
                                content: '清位时间:',
                                price: this.state.date[i].recoveryDate ? this.state.date[i].recoveryDate.split(':')[0] + ':' + this.state.date[i].recoveryDate.split(':')[1] : 0
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

    getAlllowDays() {
        HttpTool.post(APILXF.api_get_airlineDates,
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
            }, {airlineId: this.props.listdata.id})
    }

    // 封装批量修改
    modifyData(values, myValidate) {
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
        HttpTool.post(APILXF.api_airlines_add,
            (code, msg, json, option) => {
                if (code == 200) {
                    message.success('操作成功')
                    this.showModal(false);
                    // 刷新日历
                    this.dateGetReturn();
                    // 清空
                    this.setState({
                        recycleDay: ''
                    })
                    // 清空表单
                    this.form.resetFields()
                } else {
                    message.success(msg)
                }
            },
            (code, msg, option) => {
                message.warning(msg);
            }
            , Object.assign({flightDates: this.state.datesArr, airlineId: this.props.listdata.id}, values)
        )
    }

    export(data) { //子组件调用跳转导出乘机人
        const ras = {};
        ras.airlineId = this.props.post.id;
        ras.currentDate = data;
        this.props.openTab({
            path: "ExportOpportunity",
            title: "导出乘机人",
            post: ras,
        });
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
                openTabadd={this.export.bind(this)}
                loadData={this.ObtainloadData.bind(this)}
                nowadays={this.state.nowadays}
                openTab={this.export.bind(this)}
                tab={1}/>

        );
    }

    onSelect(value) {
        console.log(moment(value).format("YYYY-MM"));
        this.setState({
            dateSelect: value,
        });
        this.loadData(APILXF.api_detail, {
            airlineId: this.props.listdata.id,
            accountId: this.props.listdata.accountId,
            startDate: moment(value).format("YYYY-MM") + '-01',
            endDate: moment(value).endOf('month').format("YYYY-MM-DD")
        });
    }

    // 通过参数控制多个modal显
    changeModal(rightType) {
        switch (rightType) {
            case 'modifyPrice':
                this.modalTitle = "批量设置团期价格"
                break;
            case 'modifyStock':
                this.modalTitle = "批量设置团期库存"
                break;
            case 'modifyClearTime':
                this.modalTitle = "批量设置清位时间"
                break;
            case 'addStage':
                this.modalTitle = "新增团期报价"
                break;
            default:
                break;
        }
        this.setState({
            rightType: rightType,
            visible: true,
            selectedTips: [],
            datesArr: []
        })
        // 如果只是关闭叉叉
        this.outter && this.outter.resetCalendar()
    }

    // 通过参数控制多个modal显
    showModal(isShow = false) {
        this.form.resetFields()
        this.setState({
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

        let [year, month, day] = [
            +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('YYYY'),
            +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('MM') - 1,
            +moment(this.props.listdata.flightDate, "YYYY-MM-DD").format('DD')
        ]
        return (
            <div className={css.container}>
                {this.props.disabledadd ?
                    <div className={css.btnBox}>
                        <Button onClick={this.showImportModal.bind(this, true)}>价格批量导入</Button>
                        {/* <Button onClick={this.changeModal.bind(this, "addStage")}>新增团期报价</Button> */}
                        <Button onClick={this.changeModal.bind(this, "modifyPrice")}>修改价格</Button>
                        <Button onClick={this.changeModal.bind(this, "modifyStock")}>修改库存</Button>
                        <Button onClick={this.changeModal.bind(this, "modifyClearTime")}>修改清位时间</Button>
                    </div> : null
                }
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
                                    canPick={this.state.canPick}
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
                        listdata={this.props.listdata} airlineId={this.props.listdata.id}
                        upFile={this.upLoadFile.bind(this)}/>
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
                            label="成人结算价"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 9}}
                        >
                            {getFieldDecorator('adultPrice', {
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
                            label="儿童结算价"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 9}}
                        >
                            {getFieldDecorator('childPrice', {
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
                        {getFieldDecorator('storeType', {
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
                        {getFieldDecorator('storeCount', {
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
                        {getFieldDecorator('recycleDay', {
                            rules: [{required: true, message: '必填'}, {
                                pattern: /^[1-9]\d{0,4}$/,
                                message: "请输入小于6位的正整数"
                            }],
                        })(
                            <Input style={{width: '150px'}} addonBefore={'于'} addonAfter={'天前清位'}/>
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
                message.obj('上传文件不能大于4MB，请重新导入');
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
            if (obj.file.response) {
                HttpTool.post(APILXF.api_airlines_import,
                    (code, msg, json, option) => {
                        code == "200" ? message.success(msg) : message.warning(msg + "上传失败")
                    }, (code, msg, json, option) => {
                        message.warning(msg + "上传失败");
                    }, {
                        airlineId: this.props.airlineId,
                        fileUrl: obj.file.response.data.url.split("/")[obj.file.response.data.url.split("/").length - 1],
                    })
            }
            this.setState({
                fileList: obj.fileList
            })

        }
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
                                initialValue: this.props.listdata && this.props.listdata.airlineNo
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
                                initialValue: this.props.listdata && this.props.listdata.flightNumber
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
                            action="/Upload"
                            headers={{
                                authorization: 'authorization-text',
                            }}
                            accept='.xlsx,.xls'
                            fileList={this.state.fileList}
                            onChange={this.beforeUploadGroup.bind(this)}
                        >
                            <Button>导入</Button>
                        </Upload>
                    )
                    }
                    <span>文件大小不能超过4MB，<a
                        href="http://voucher.apin.com/%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx">模板下载</a></span>
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
