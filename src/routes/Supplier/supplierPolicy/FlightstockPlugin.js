import React, {Component} from 'react'
import {Checkbox, message, Col, Button} from 'antd'

const CheckboxGroup = Checkbox.Group;
// import HttpTool from '../../../http/HttpTool.js';
import css from './Flightstock.less';

class Masking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flightdata: {},
            optionsWithDisabled: [
                {value: 1, label: '星期一'},
                {value: 2, label: '星期二'},
                {value: 3, label: '星期三'},
                {value: 4, label: '星期四'},
                {value: 5, label: '星期五'},
                {value: 6, label: '星期六'},
                {value: 0, label: '星期天'},
            ],
        };
    }

    componentDidMount() {
        // this.filter();
        let data = this.state.flightdata;
        data.week = this.props.week;
        this.setState({
            flightdata: data,
        });
    }

    loadData(url, param, ole) {
        log(param);
        HttpTool.post(HttpTool.typeEnum.POST, url,
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

    weeks(checkedValues) {
        let data = this.state.flightdata;
        let kyes = this.props.kyes;
        data.week = checkedValues;
        this.setState({
            flightdata: data,
        });
        this.props.weekSelect(checkedValues, kyes)
    }

    componentWillReceiveProps(nextProps) {

        let data = this.state.flightdata;

        // if(JSON.stringify(data.week) == JSON.stringify(nextProps.week)){
        //     return false
        // }
        data.week = nextProps.week;
        this.setState({
            flightdata: data,
        });
        // this.filter();
        return false;
    }

    Updates() {
        let data = this.props.data.flightNo;
        let kyes = this.props.kyes;
        this.props.Updates(kyes, data);
    }

    render() {
        return (
            <div>
                <div className={css.flightArrDetails}>
                    <Col span={24} className={css.flightArrHeader}>
                        {this.props.data.flightNo}
                        <Button className={css.updates} disabled={this.props.disabledadd}
                                onClick={this.Updates.bind(this)} type="primary">更新</Button>
                    </Col>
                    <Col span={this.props.data.stopFlag ? 11 : 12}>
                        <Col span={24} className={css.flightCaption}>
                            {this.props.data.flightDepAirport}
                        </Col>
                        <Col span={24}>
                            {this.props.data.flightDep}
                        </Col>
                        <Col span={24}>{this.props.data.flightDeptimePlanDate}</Col>
                    </Col>
                    {this.props.data.stopFlag &&
                    <Col span={2} style={{fontSize: '16px'}}>
                        经停
                    </Col>
                    }
                    <Col span={this.props.data.stopFlag ? 11 : 12}>
                        <Col span={24} className={css.flightCaption}>
                            {this.props.data.flightArrAirport}
                        </Col>
                        <Col span={24}>
                            {this.props.data.flightArr}
                        </Col>
                        <Col span={24}>{this.props.data.flightArrtimePlanDate}</Col>
                    </Col>
                    {this.props.kyes == 0 &&
                    <Col span={24} className={css.flightArrWeek}>
                        <div>
                            <Col span={24} style={{
                                textAlign: 'left',
                                paddingLeft: '30px',
                                marginBottom: '5px'
                            }}>每周班期</Col>
                            <CheckboxGroup
                                options={this.state.optionsWithDisabled} value={this.state.flightdata.week}
                                onChange={this.weeks.bind(this)}
                                disabled={this.props.disabledadd}

                            />
                        </div>
                    </Col>
                    }

                </div>
                <Col span={24}>
                    <div>所属航司：{this.props.data.flightCompany}</div>
                </Col>
            </div>
        )
    }
}

export default Masking
