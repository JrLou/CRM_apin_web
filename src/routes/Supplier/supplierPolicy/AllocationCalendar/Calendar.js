import React, { Component } from 'react'
import CalendarHeader from './CalendarHeader'
import CalendarMain from './CalendarMain'
import CalendarFooter from './CalendarFooter'
import './Calendar.less'
const displayDaysPerMonth = (year) => {

    //定义每个月的天数，如果是闰年第二月改为29天
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
    }

    //以下为了获取一年中每一个月在日历选择器上显示的数据，
    //从上个月开始，接着是当月，最后是下个月开头的几天

    //定义一个数组，保存上一个月的天数
    let daysInPreviousMonth = [].concat(daysInMonth)
    daysInPreviousMonth.unshift(daysInPreviousMonth.pop())

    //获取每一个月显示数据中需要补足上个月的天数
    let addDaysFromPreMonth = new Array(12)
        .fill(null)
        .map((item, index) => {
            let day = new Date(year, index, 1).getDay()
            if (day === 0) {
                return 6
            } else {
                return day - 1
            }
        })

    //已数组形式返回一年中每个月的显示数据,每个数据为6行*7天
    return new Array(12)
        .fill([])
        .map((month, monthIndex) => {
            let addDays = addDaysFromPreMonth[monthIndex],
                daysCount = daysInMonth[monthIndex],
                daysCountPrevious = daysInPreviousMonth[monthIndex],
                monthData = []
            //补足上一个月
            for (; addDays > -1; addDays--) {
                monthData.unshift(daysCountPrevious--)
            }
            //添入当前月
            for (let i = 0; i < daysCount;) {
                monthData.push(++i)
            }
            //补足下一个月
            for (let i = 42 - monthData.length, j = 0; j < i;) {
                monthData.push(++j)
            }
            return monthData
        })
}

class Calendar extends Component {
    constructor(props) {
        //继承React.Component
        super()
        let now = new Date()
        let month = props.month;
        if (month != 0) {
            month = month || now.getMonth()
        }
        this.state = {
            year: props.year || now.getFullYear(),
            month: month,
            day: props.day || now.getDate(),
            picked: false,
            selcetedDays: {},
            checkedValues: [],
            colsToMonth: {}
        }
    }
    // 初始化
    resetCalendar() {
        let now = new Date()
        let month = this.props.month;
        if (month != 0) {
            month = month || now.getMonth()
        }
        this.setState({
            year: this.props.year || now.getFullYear(),
            month: month,
            day: this.props.day || now.getDate(),
            selcetedDays: {},
            checkedValues: [],
            colsToMonth: {}
        })
    }

    //切换到下一个月
    nextMonth() {
        if (this.state.month === 11) {
            // 更新库存
            // this.props.updateMonthStocks(this.state.year + 1, 0)
            this.setState({
                year: ++this.state.year,
                month: 0
            })
        } else {
            // 更新库存
            // this.props.updateMonthStocks(this.state.year, this.state.month + 1)
            this.setState({
                month: ++this.state.month
            })
        }
        // 切换月份取消勾选
        this.setState({
            checkedValues: this.getMonthCol(this.state.colsToMonth, this.state.year, this.state.month)
        })
    }
    //切换到上一个月
    prevMonth() {

        if (this.state.month === 0) {
            // 更新库存
            // this.props.updateMonthStocks(this.state.year - 1, 11)
            this.setState({
                year: --this.state.year,
                month: 11
            })
        } else {
            // 更新库存
            // this.props.updateMonthStocks(this.state.year, this.state.month - 1)
            this.setState({
                month: --this.state.month
            })
        }
        // 切换月份取消勾选
        this.setState({
            checkedValues: this.getMonthCol(this.state.colsToMonth, this.state.year, this.state.month)
        })
    }
    //选择日期
    datePick(y, m, d, stock) {
        // 判断是否已经选择了。
        let newSelected = this.state.selcetedDays
        let newSelectStocks = this.state.selectedStock
        if (newSelected[y]) {
            if (newSelected[y][m + 1]) {
                let index = newSelected[y][m + 1].days.indexOf(d)
                if (index == -1) {
                    newSelected[y][m + 1].days.push(d);
                    newSelected[y][m + 1].stocks.push(stock);
                }
                else {
                    newSelected[y][m + 1].days.splice(index, 1);
                    newSelected[y][m + 1].stocks.splice(index, 1);
                }
            } else {
                // 本月份没有信息新建对象存储
                newSelected[y][m + 1] = {
                    'days': [d],
                    'stocks': [stock]
                }
            }
        } else {
            // 本年份没有信息新建对象存储
            newSelected[y] = {}
            newSelected[y][m + 1] = {
                'days': [d],
                'stocks': [stock]
            }
        }

        this.setState({
            selcetedDays: newSelected
        })
        // 向父组件传选择的信息
        this.props.getPickInfo(newSelected)
    }

    showCalendar() {
        this.props.toogleShow()
    }
    setNewPicks(picks) {
        this.setState({
            selcetedDays: picks
        })
        // 向父组件传选择的信息
        this.props.getPickInfo(picks)
    }
    saveChecked(values) {
        this.setState({
            checkedValues: values
        })
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
    // 获取勾选映射，改变年月时改变勾选
    getMonthColInfo(totalObj) {
        this.setState({
            colsToMonth: totalObj
        })
    }
    render() {
        let publicProps = {
            viewData: displayDaysPerMonth(this.state.year),
            datePicked: `${this.state.year} 年
                         ${this.state.month + 1} 月
                         ${this.state.day} 日`
        }
        // 取出当月已选数据
        let currentSelect = this.state.selcetedDays[this.state.year]
            ? this.state.selcetedDays[this.state.year][this.state.month + 1]
            : null;
        currentSelect = currentSelect ? currentSelect.days : []
        return (
            <div className="showMyCalendar">
                <div className="main" ref="main">
                    <CalendarHeader  {...publicProps}
                        getMonthColInfo={this.getMonthColInfo.bind(this)}
                        checkedValues={this.state.checkedValues}
                        saveChecked={this.saveChecked.bind(this)}
                        stocks={this.props.currenMonthStocks}
                        canPick={this.props.canPick}
                        selcetedInfo={this.state.selcetedDays}
                        getNewPicks={this.setNewPicks.bind(this)}
                        prevMonth={this.prevMonth.bind(this)}
                        nextMonth={this.nextMonth.bind(this)}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day} />

                    <CalendarMain {...publicProps}
                        stocks={this.props.currenMonthStocks}
                        canPick={this.props.canPick}
                        selcetedDays={currentSelect}
                        prevMonth={this.prevMonth.bind(this)}
                        nextMonth={this.nextMonth.bind(this)}
                        datePick={this.datePick.bind(this)}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day} />
                    <CalendarFooter
                        showCalendar={this.showCalendar.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default Calendar