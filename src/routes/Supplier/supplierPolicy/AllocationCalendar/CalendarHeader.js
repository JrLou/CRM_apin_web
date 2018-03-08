import React, { Component } from 'react'
import { Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group;
import moment from 'moment'
// 相比上次勾选增加和减少的列

class CalendarHeader extends Component {
    constructor() {
        super()
        this.state = {
            colunms: {}
        }
    }
  componentDidMount() {
    console.log('看看有没有传过来wwww')
    console.log(this.props.canPick)
  }
    addPicks(currenMonth, addCol) {
        let year = this.props.year,
            month = this.props.month,
            pickedInfo = this.props.selcetedInfo;
        let dayAdds = [],
            stockAdds = []
        let i = currenMonth.indexOf(1),
            j = currenMonth.indexOf(1, i + 1);
        addCol.map((v, k) => {
            currenMonth.map((_v, _k) => {
                if (_k >= i && _k < j) {
                    _k % 7 == v
                        ?
                        (() => {
                            // 小于今天也不让选
                            // let currentDay = this.props.year + '-' + (this.props.month + 1) + '-' + _v;
                            // if (+new Date().getTime() > +moment(currentDay, "YYYY-MM-DD").format('x')+(24*60*60*1000)) {
                            //     return
                            // }
                            // 可选区间内才让选
                            let currentDay = this.props.year + '-' + (this.props.month + 1) + '-' + _v;
                            let currentDayMs = moment(currentDay, 'YYYY-MM-DD').format('x');
                            if (this.props.canPick.indexOf(currentDayMs) < 0) {
                                return
                            }

                            // if (this.props['stocks'][_k - i] == 0) { return }
                            dayAdds.push(_v)
                            stockAdds.push(this.props['stocks'][_k - i])
                        })()
                        : null;
                }
            })
        })
        // 和原保存数据结合

        if (pickedInfo[year]) {
            if (pickedInfo[year][month + 1]) {
                pickedInfo[year][month + 1]['days'].map((v, k) => {
                    if (dayAdds.indexOf(v) > -1) {
                        dayAdds.splice(dayAdds.indexOf(v), 1)
                        stockAdds.splice(dayAdds.indexOf(v), 1)
                    }
                })
                // 拼接去重后的adds
                pickedInfo[year][month + 1] = {
                    'days': pickedInfo[year][month + 1]['days'].concat(dayAdds),
                    'stocks': pickedInfo[year][month + 1]['stocks'].concat(stockAdds)
                }

            } else {
                pickedInfo[year][month + 1] = {
                    'days': dayAdds,
                    'stocks': stockAdds
                }

            }
        } else {
            // 当前年没有数据建立对象保存
            pickedInfo[year] = {}
            pickedInfo[year][month + 1] = {
                'days': dayAdds,
                'stocks': stockAdds
            }

        }
        return pickedInfo
    }
    reducePicks(currenMonth, reduceCol) {
        let year = this.props.year,
            month = this.props.month,
            pickedInfo = this.props.selcetedInfo;
        let dayReduces = [],
            stockReduces = []
        let i = currenMonth.indexOf(1),
            j = currenMonth.indexOf(1, i + 1);
        reduceCol.map((v, k) => {
            currenMonth.map((_v, _k) => {
                if (_k >= i && _k < j) {
                    _k % 7 == v
                        ?
                        (() => {
                            // if (this.props['stocks'][_k - i] == 0) { return }
                            dayReduces.push(_v)
                            stockReduces.push(this.props['stocks'][_k - i])
                        })()
                        : null;
                }
            })
        })
        // 和原保存数据结合
        let originPicked = Object.assign({}, pickedInfo)
        let originPickedDays = originPicked[year][month + 1] ? originPicked[year][month + 1]['days'] : [];
        let originPickedStocks = originPicked[year][month + 1] ? originPicked[year][month + 1]['stocks'] : [];
        // 去掉勾勾的时候肯定会取到所以不用判断
        if (pickedInfo[year][month + 1]) {
            pickedInfo[year][month + 1]['days'].map((v, k) => {
                // if (dayReduces.indexOf(v) > -1) {
                //     pickedInfo[year][month + 1]['days'] = pickedInfo[year][month + 1]['days'].filter((_v, _k) => {
                //         return _v !== v
                //     })
                //     pickedInfo[year][month + 1]['stocks'] = pickedInfo[year][month + 1]['stocks'].filter((_v, _k) => {
                //         return _v !== originPicked[year][month + 1]['stocks'][k]
                //     })
                // }
            })
        }
        dayReduces.map((v, k) => {
            if (originPickedDays.indexOf(v) > -1) {
                originPickedDays.splice(originPickedDays.indexOf(v), 1)
                originPickedStocks.splice(originPickedDays.indexOf(v), 1)
            }
        })
        return originPicked
    }
    // 两层对象判断返回列没有为[]
    getMonthCol(totalObj, first, second) {
        if (totalObj[first]) {
            if (totalObj[first][second]) {
                return totalObj[first][second]
            } else {
                return []
            }
        } else {
            return []
        }
    }
    // 判断前两层设置第三层的值
    setMonthObj(orignObj, year, month, value) {
        if (orignObj[year]) {
            if (orignObj[year][month]) {
                orignObj[year][month] = value
            } else {
                orignObj[year] = {
                    [month]: value
                }
            }
        } else {
            orignObj[year] = {
                [month]: value
            }
        }
        return orignObj
    }
    onChange(checkedValues) {
        let year = this.props.year
        let month = this.props.month
        let day = this.props.day

        let addCol = [],
            reduceCol = [],
            pickedInfo;

        let oldColunms = this.getMonthCol(this.state.colunms, year, month);

        let currenMonth = this.props.viewData[this.props.month];
        log('checked = ', checkedValues);
        // 把勾选信息传到父组件保存
        this.props.saveChecked(checkedValues)
        checkedValues.map((v, k) => {
            oldColunms.indexOf(v) == -1 ? addCol.push(v) : null;
        })
        oldColunms.map((v, k) => {
            checkedValues.indexOf(v) == -1 ? reduceCol.push(v) : null;
        })
        // 计算增加的列日期
        addCol.length > 0 ? pickedInfo = this.addPicks(currenMonth, addCol) : null;
        // 计算减少的列日期
        reduceCol.length > 0 ? pickedInfo = this.reducePicks(currenMonth, reduceCol) : null;
        this.props.getNewPicks(pickedInfo)
        // 保存当前勾选状态 和年月映射起来
        let newColInfo = this.setMonthObj(this.state.colunms, year, month, checkedValues)
        this.setState({
            colunms: newColInfo
        })
        this.upColInfo()
    }
    // 把col 年月映射上到父组件
    upColInfo() {
        this.props.getMonthColInfo(this.state.colunms)
    }
    render() {
        const options = [
            { label: '日', value: 0 },
            { label: '一', value: 1 },
            { label: '二', value: 2 },
            { label: '三', value: 3 },
            { label: '四', value: 4 },
            { label: '五', value: 5 },
            { label: '六', value: 6 },
        ];
        return (
            <div>
                <div className="calendarHeader">
                    <span className="prev"
                        onClick={this.props.prevMonth}>
                        {'<'}
                    </span>
                    <span className="next"
                        onClick={this.props.nextMonth}>
                        {'>'}
                    </span>
                    <span className="dateInfo">
                        {this.props.year}年{this.props.month + 1}月
                    </span>
                </div>
                <div className="dayCheckGroup">
                    <CheckboxGroup
                        value={this.props.checkedValues}
                        options={options}
                        onChange={this.onChange.bind(this)} />
                </div>
            </div>

        )
    }
}

export default CalendarHeader
