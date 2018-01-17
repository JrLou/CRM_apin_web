//缩略图的组件
/**
 * Created by ylb on 17/10/14.
 */
import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import css from './SearchFlight.less';
import moment from 'moment';
import FlightCard from './FlightCard';
class FlightList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    selectThisRow(selectedRows) {
        this.onSelectChange([selectedRows._id], [selectedRows])
    }
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }

    // 选择了航班
    selectFlight() {
        if (!this.state.selectedRowKeys || !this.state.selectedRowKeys.length) {
            message.warning('请选择一个航班')
            return
        }
        this.props.getFlight(this.state.selectedRows)
    }
    render() {
        const { Column } = Table;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            type: "radio"
        };
        return <div>
            <div className={css.tableBox}>
                <Table
                    pagination={false}
                    showHeader={false}
                    dataSource={this.props.tableData}
                    rowKey={record => record._id}
                    rowSelection={rowSelection}
                    onRowClick={this.selectThisRow.bind(this)}
                >
                    <Column
                        title=""
                        className={css.lastCol}
                        key="action"
                        render={(text, record, index) => {
                            // record.flightDeptimePlanDate = moment(record.flightDeptimePlanDate, "HH:mm:ss").format('HH:mm');
                            // record.flightArrtimePlanDate = moment(record.flightArrtimePlanDate, "HH:mm:ss").format('HH:mm');
                            return <FlightCard visiable={true} cardData={record} />;
                        }}
                    />
                </Table>
            </div>
            <div className={css.btnGroup}><Button type='primary' onClick={this.selectFlight.bind(this)}>选择该航班</Button></div>
        </div>
    }
}
export default FlightList;