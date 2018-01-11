/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Table } from 'antd';
import { Link } from 'dva/router';
class LogTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const loColumns = [{
            title: '推送时间',
            dataIndex: 'id',
            render: (text, record) => <Link to={'/fightgroups/demand/checkFightGroups'}>{text}</Link>,
        },

        {
            title: '航班号',
            dataIndex: 'depAirport',
        },
        {
            title: '起飞日期',
            dataIndex: 'arrAirport',
        },
        {
            title: '返回日期',
            dataIndex: 'createTime',
        },
        {
            title: '销售价',
            dataIndex: 'createTimePeriod',
        },
        {
            title: '用户反馈',
            dataIndex: 'status',
        },
        {
            title: '原因',
            dataIndex: 'isAllowChange',
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
