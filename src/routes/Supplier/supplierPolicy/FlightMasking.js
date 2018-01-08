import React, {Component} from 'react'
import { Modal, InputNumber, DatePicker, Checkbox, Table, message, Row, Col} from 'antd'
const CheckboxGroup = Checkbox.Group;
const { RangePicker} = DatePicker;
// import HttpTool from '../../../http/HttpTool.js';
import Algorithm from './FlightstockAlgorithm.js';
import css from './Flightstock.less';
import AllocationCalendar from './AllocationCalendar/MultipleSelectCalendar.js';

class Masking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleCalendar: false,
            data: {},
            queryDate: [],
            inputdata: {},
            adultNumber: 0,
            childNumber: 0,
            cycleDate: [],
            cycleDateadd: [],
            show: false,
            isNull: false,
            isNull1: false,
            isInteger: true,
            isInteger1: true,
            currenMonthStocks: new Array(31).fill(2),
        };
    }

    componentDidMount() {
    }

    maskings(olr, value, event) {
        this.setState({
            visible: false,
        });
    }

    maskingsdown(olr, value, event) {
        if (this.props.listData.tishis == 1) {
            this.setState({
                visible: true,
            });
        }
        //通知他爹,我进来了,其他关闭吧
        if (this.props.in) {
            this.props.in(this.maskings.bind(this));
        }
    }

    handleCancel(e) {
        this.setState({show: false, isNull: false, isInteger: true, isNull1: false, isInteger1: true})
        this.setState({
            visibleCalendar: false,
        });
        this.props.loadData();
    }

    handleOk() {
        this.setState({show: false, isNull: false, isInteger: true, isNull1: false, isInteger1: true})
        // this.setState({
        //     visibleCalendar: false,
        // });
        switch (this.state.data.identify) {
            case 0:
                this.setState({
                    visibleCalendar: false,
                });
                this.loadData("/apinAirline/reduceStock", {
                    airlineId: this.props.listData.airlineId,
                    currentDate: this.props.listData.date,
                    stockNumber: this.state.inputdata.stockNumber,
                });
                break;
            case 1:
                if (this.state.inputdata.remainingNumber === '') {
                    this.setState({isNull: true})
                } else if (!(/(^[0-9]\d*$)/.test(this.state.inputdata.remainingNumber))) {
                    this.setState({isInteger: false})
                } else {
                    this.setState({
                        visibleCalendar: false,
                    });
                    log(this.state.inputdata);
                    this.loadData("/apinAirline/modifyStock", {
                        airlineId: this.props.listData.airlineId,
                        currentDate: this.props.listData.date,
                        stockNumber: this.state.inputdata.remainingNumber,
                    });
                }
                break;
            case 2:
                if (this.state.adultNumber === '') {
                    this.setState({isNull: true})
                } else if (!(/(^[0-9]\d*$)/.test(this.state.adultNumber))) {
                    this.setState({isInteger: false})
                } else if (this.state.childNumber === '') {
                    this.setState({isNull1: true})
                } else if (!(/(^[0-9]\d*$)/.test(this.state.childNumber))) {
                    this.setState({isInteger1: false})
                } else {
                    this.setState({
                        visibleCalendar: false,
                    });
                    let datazu = [];
                    datazu.push(this.props.listData.date);
                    this.loadData("/apinAirline/modifyPrice", {
                        airlineId: this.props.listData.airlineId,
                        currentDate: this.props.listData.date,
                        adultPrice: this.state.adultNumber,
                        childPrice: this.state.childNumber,
                        dateList: datazu,
                    });
                }
                break;
            case 3:
                if (this.state.adultNumber === '') {
                    this.setState({isNull: true})
                } else if (!(/(^[0-9]\d*$)/.test(this.state.adultNumber))) {
                    this.setState({isInteger: false})
                } else if (this.state.childNumber === '') {
                    this.setState({isNull1: true})
                } else if (!(/(^[0-9]\d*$)/.test(this.state.childNumber))) {
                    this.setState({isInteger1: false})
                } else {
                    this.setState({
                        visibleCalendar: false,
                    });
                    this.loadData("/apinAirline/modifyPrice", {
                        airlineId: this.props.listData.airlineId,
                        currentDate: this.props.listData.date,
                        adultPrice: this.state.adultNumber,
                        childPrice: this.state.childNumber,
                        dateList: this.state.cycleDateadd,
                    });
                }

                break;
        }
    }

    showModal(ole, event) {
        const data = {};
        const value = {};
        this.setState({
            visibleCalendar: true,
        });
        switch (ole) {
            case 0:
                data.txt = "销客";
                data.identify = 0;
                value.stockNumber = this.props.listData.list[2].price ? this.props.listData.list[2].price : 0;
                this.setState({
                    data: data,
                    inputdata: value,
                });
                break;
            case 1:
                data.txt = "修改库存";
                data.identify = 1;
                value.remainingNumber = this.props.listData.list[2].price ? this.props.listData.list[2].price : 0;
                this.setState({
                    data: data,
                    inputdata: value,
                });
                break;
            case 2:
                data.txt = "当日价格修改";
                data.identify = 2;
                this.setState({
                    data: data,
                    adultNumber: this.props.listData.list[0].price,
                    childNumber: this.props.listData.list[1].price,
                });
                break;
            case 3:
                data.txt = "周期价格修改";
                data.identify = 3;
                this.setState({
                    data: data,
                    adultNumber: this.props.listData.list[0].price,
                    childNumber: this.props.listData.list[1].price,
                });
                break;
            case 4:
                data.txt = "所有航班列表信息";
                data.identify = 4;
                this.loadData("/apinAirline/v1.0/homeAirlineInfo", {
                    queryDate: this.props.listData.date
                }, 1);
                this.setState({
                    data: data,
                });
                break;
        }
    }

    loadData(url, param, ole) {
        log(param);
        HttpTool.post(url,
            (code, msg, json, option) => {
                if (ole == 1) {
                    this.setState({
                        queryDate: json,
                    });
                } else {
                    message.warning(msg);
                    this.props.loadData();
                }
            },
            (code, msg, option) => {
                message.warning(msg);
            }
            , param
        );

    }

    DateFinishing(value) {
        const cycleDateadd = [];
        log(value);
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.cycleDate.length; j++) {
                if (new Date(this.state.cycleDate[j]).getDay() == value[i]) {
                    cycleDateadd.push(this.state.cycleDate[j])
                }
            }
        }
        this.setState({
            cycleDateadd: cycleDateadd,
        });
        console.log(cycleDateadd);
    }

    onChange(ole, e) {
        const data = {};
        switch (ole) {
            case 0:
                data.stockNumber = e.target.value;
                this.setState({
                    inputdata: data,
                });
                break;
            case 1:
                data.remainingNumber = e.target.value;
                this.setState({
                    inputdata: data,
                });
                break;
            case 2:
                this.setState({
                    adultNumber: e.target.value,
                });
                break;
            case 3:
                this.setState({
                    childNumber: e.target.value,
                });
                break;
            case 4:
                this.DateFinishing(e);
                break;
        }
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current.valueOf() < Date.now();
    }

    getDate(datestr) {
        var temp = datestr.split("/");
        var date = new Date(temp[0], temp[1], temp[2]);
        return date;
    }


    jump(record, event) {
        this.props.openTab(record);
        this.setState({
            visibleCalendar: false,
        });
    }

    dateplus(ole, event) {
        let timing = {};
        timing.a = 0;
        let data = {};
        switch (ole) {
            case 0:
                timing.a++;
                data.stockNumber = timing;
                this.setState({
                    inputdata: data,
                });
                break;
            case 1:
                data.stockNumber = timing;
                this.setState({
                    inputdata: data,
                });
                break;
            case 2:
                timing.a += 1;
                debugger
                data.stockNumber = timing.a;
                this.setState({
                    inputdata: data,
                });
                break;
        }
    }

    showPickInfo(pickInfo) {
        console.log(pickInfo);
    }

    getCurrenMonthStocks(year = new Date().getFullYear(), month = new Date().getMonth()) {


    }

    render() {
        const dateFormat = 'YYYY/MM/DD';
        const plainOptions = [{label: '周一', value: 1}, {label: '周二', value: 2}, {label: '周三', value: 3}, {
            label: '周四',
            value: 4
        }, {label: '周五', value: 5}, {label: '周六', value: 6}, {label: '周日', value: 0}];
        const columns = [{
            title: '往返城市',
            dataIndex: 'voyage',
            key: 'voyage',
        }, {
            title: '班次',
            dataIndex: 'flightNumber',
            key: 'flightNumber',
        }, {
            title: '周期',
            dataIndex: 'departureStart',
            key: 'departureStart',
            render: (text, record) => (
                <span>
                    {record.departureStart + '-' + record.departureEnd}
                </span>
            ),
        }];
        const qinwei =this.props.listData.qinwei;
        let [year, month, day] = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]

        return (
            <div>

                {!this.state.visible &&
                <ul className={css.events}>
                    {
                        this.props.listData.list.map(function (item) {
                            return (
                                <li key={item.content}>
                                    {item.type ? <span className={qinwei ? css[`event-${item.type}`] : {}}>●</span> : <span></span>}
                                    {item.content == "暂无班期" ? <span className={css.air}>{item.content}</span> : <span className={css.event}>{item.content}</span>}
                                    <span style={{fontSize: '16px', lineHeight: '11PX'}}> {item.price}</span>
                                </li>
                            )
                        })
                    }
                </ul>
                }
                {this.state.visibleCalendar &&
                <Modal
                    title={this.state.data.txt}
                    style={{top: 300}}
                    visible={this.state.visibleCalendar}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    {this.state.data.identify == 0 && this.props.tab == 1 &&
                    <div className={css.content}>
                        {/*<Row>*/}
                        {/*<Col className={css.jianju} span={12}>*/}
                        {/*当前未分配：<span*/}
                        {/*style={{fontSize: '18px'}}>{this.props.listData.list[2].price ? this.props.listData.list[2].price : 0}</span>*/}
                        {/*</Col>*/}
                        {/*<Col span={24}>*/}
                        {/*<span style={{marginLeft: "-41px"}}><span*/}
                        {/*style={{color: '#f1533e'}}>*</span>填写当前已售：</span>*/}
                        {/*<InputNumber size="large" style={{width: '40px'}}//min={1}*/}
                        {/*defaultValue={this.props.listData.list[2].price}*/}
                        {/*onChange={this.onChange.bind(this, 0)}/>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}

                        <AllocationCalendar
                            year={year}
                            month={month}
                            day={day}
                            updateMonthStocks={this.getCurrenMonthStocks.bind(this)}
                            currenMonthStocks={this.state.currenMonthStocks}
                            placeholder={'选择分配时间'}
                            upPickInfo={this.showPickInfo.bind(this)}/>
                    </div>
                    }
                    {this.state.data.identify == 1 && this.props.tab == 1 &&
                    <div className={css.content}>
                        <Row>
                            <Col className={css.jianju} span={12}>
                                <p> 原库存：<span
                                    style={{fontSize: '18px'}}>{this.props.listData.list[2].price ? this.props.listData.list[2].price : 0}</span>
                                </p>
                            </Col>
                            <Col span={24}>
                                    <span style={{marginLeft: '-68px'}}><span
                                        style={{color: '#f1533e'}}>*</span>现库存：</span>
                                <InputNumber className={css.inputcss} size="large" style={{width: '40px'}}
                                             defaultValue={this.props.listData.list[2].price}
                                             onChange={this.onChange.bind(this, 1)}
                                />

                                <p style={{marginLeft: '140px'}}
                                   className={this.state.isNull ? css.fontColor : css.display}>现库存不能为空</p>
                                <p style={{marginLeft: '120px'}}
                                   className={this.state.isInteger ? css.display : css.fontColor}>只允许输入正整数和0</p>
                            </Col>
                        </Row>
                    </div>
                    }
                    {this.state.data.identify == 2 &&
                    <div className={css.content}>
                        <Row>
                            <Col className={css.jianju} span={12}>
                                <p>原成人价：<span
                                    style={{fontSize: '18px'}}>{this.props.listData.list[0].price ? this.props.listData.list[0].price : 0}</span>
                                </p>
                            </Col>
                            <Col className={css.jianju} span={12}>
                                <p>原儿童价：<span
                                    style={{fontSize: '18px'}}>{this.props.listData.list[1].price ? this.props.listData.list[1].price : 0}</span>
                                </p>
                            </Col>
                            <Col span={12}>
                                <span style={{color: '#f1533e'}}>*</span>
                                <span style={{marginRight: '20px'}}>原成人价:</span>
                                <InputNumber size="large" style={{width: '40px'}} //min={0}
                                             defaultValue={this.props.listData.list[0].price ? this.props.listData.list[0].price : 0}
                                             onChange={this.onChange.bind(this, 2)}/>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isNull ? css.fontColor : css.display}>原成人价不能为空</p>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isInteger ? css.display : css.fontColor}>只允许输入正整数和0</p>
                            </Col>
                            <Col span={12}>
                                <span style={{color: '#f1533e',}}>*</span>
                                <span style={{marginRight: '20px'}}>原儿童价:</span>
                                <InputNumber size="large" style={{width: '40px'}}
                                             defaultValue={this.props.listData.list[1].price ? this.props.listData.list[1].price : 0}
                                             onChange={this.onChange.bind(this, 3)}/>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isNull1 ? css.fontColor : css.display}>原儿童价不能为空</p>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isInteger1 ? css.display : css.fontColor}>只允许输入正整数和0</p>
                            </Col>
                        </Row>
                    </div>
                    }
                    {this.state.data.identify == 3 &&
                    <div className={css.content}>
                        <Row>
                            <Col span={6}> <span style={{color: '#f1533e',}}>*</span>航班周期</Col>
                            <Col span={18} className={css.edge}>
                                <RangePicker className={css.jianju}
                                             disabledDate={this.disabledDate.bind(this)}
                                             format={dateFormat}
                                             onChange={Algorithm.dateRange.bind(this)}

                                />
                                <Col span={21} style={{marginLeft: '33px'}}> <CheckboxGroup options={plainOptions}
                                                                                            onChange={this.onChange.bind(this, 4)}/></Col>
                            </Col>
                            <Col className={css.jianju} span={12}>
                                <p>原成人价：<span
                                    style={{fontSize: '18px'}}>{this.props.listData.list[0].price ? this.props.listData.list[0].price : 0}</span>
                                </p>
                            </Col>
                            <Col className={css.jianju} span={12}>
                                <p>原儿童价：<span
                                    style={{fontSize: '18px'}}>{this.props.listData.list[1].price ? this.props.listData.list[1].price : 0}</span>
                                </p>
                            </Col>
                            <Col span={12}>
                                <span style={{color: '#f1533e'}}>*</span>
                                <span style={{marginRight: '20px'}}>原成人价:</span>
                                <InputNumber size="large" style={{width: '40px'}} //min={0}
                                             defaultValue={this.props.listData.list[0].price ? this.props.listData.list[0].price : 0}
                                             onChange={this.onChange.bind(this, 2)}/>
                                <p style={{marginLeft: '30px'}}
                                   className={this.state.isNull ? css.fontColor : css.display}>原成人价不能为空</p>
                                <p style={{marginLeft: '30px'}}
                                   className={this.state.isInteger ? css.display : css.fontColor}>只允许输入正整数和0</p>
                            </Col>
                            <Col span={12}>
                                <span style={{color: '#f1533e'}}>*</span>
                                <span style={{marginRight: '20px'}}>原儿童价:</span>
                                <InputNumber size="large" style={{width: '40px'}}
                                             defaultValue={this.props.listData.list[1].price ? this.props.listData.list[1].price : 0}
                                             onChange={this.onChange.bind(this, 3)}/>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isNull1 ? css.fontColor : css.display}>原儿童价不能为空</p>
                                <p style={{marginLeft: '40px'}}
                                   className={this.state.isInteger1 ? css.display : css.fontColor}>只允许输入正整数和0</p>
                            </Col>
                        </Row>
                    </div>
                    }
                    {this.state.data.identify == 4 &&
                    <div className={css.indextab}>
                        <Table dataSource={this.state.queryDate} columns={columns}
                               pagination={false} onRowClick={this.jump.bind(this)}/>
                    </div>
                    }
                </Modal>
                }
            </div>
        )
    }
}

export default Masking
