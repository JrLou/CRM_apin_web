/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Table } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
class LogTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const loColumns = [{
            title: '推送时间',
            dataIndex: 'create_time',
            render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },

        {
            title: '航班号',
            render: (text, record) => {
                return record.flightInfo[0].flight_no + '/' + record.flightInfo[1].flight_no;
            },
        },
        {
            title: '起飞日期',
            render: (text, record) => {
                let _innerText;
                record.flightInfo.map((v, k) => {
                    if (v.trip_index == 0) {
                        _innerText = moment(v.date_dep).format('YYYY-MM-DD');
                    }
                });
                return _innerText;
            },
        },
        {
            title: '返回日期',
            render: (text, record) => {
                let _innerText;
                record.flightInfo.map((v, k) => {
                    if (v.trip_index == 1) {
                        _innerText = moment(v.date_dep).format('YYYY-MM-DD');
                    }
                });
                return _innerText;
            },
        },
        {
            title: '销售价',
            render: (text, record) => {
                return record.flightInfo[1].sell_price / 100;
            },
        },
        {
            title: '用户反馈',
            dataIndex: 'status',
            render: (text, record) => {
                let innerText = ['取消', '推送', '介绍', '支付超时'];
                return innerText[text];
            },
        },
        {
            title: '原因',
            dataIndex: 'remark',
        }];
        return (
            <Table
                dataSource={this.props.logData ? this.props.logData : []}
                columns={loColumns}
                pagination={false}
                rowKey="id"
                bordered={this.props.bordered}
            />
        )
    }
}
export default LogTable
