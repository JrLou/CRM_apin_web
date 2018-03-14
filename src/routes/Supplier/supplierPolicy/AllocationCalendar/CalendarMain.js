import React, {Component} from 'react'
import moment from 'moment'

class CalendarMain extends Component {
  //处理日期选择事件，如果是当月，触发日期选择；如果不是当月，切换月份
  handleDatePick(index, styleName, stock, isCanPick) {
    // 如果当日库存为空就点击无效
    // if (stock == 0 && styleName == "thisMonth") { return }
    // 小于当日不让选
    // if (isBeforeToday) { return }
    if (!isCanPick && styleName == "thisMonth") {
      return
    }
    switch (styleName) {
      case 'thisMonth':
        let month = this.props.viewData[this.props.month]
        this.props.datePick(
          this.props.year,
          this.props.month,
          month[index],
          stock
        )
        break
      case 'prevMonth':
        this.props.prevMonth()
        break
      case 'nextMonth':
        this.props.nextMonth()
        break
    }
  }

  //处理选择时选中的样式效果
  //利用闭包保存上一次选择的元素，
  //在月份切换和重新选择日期时重置上一次选择的元素的样式
  changeColor() {
    let previousEl = null
    return function (event) {
      let name = event.target.nodeName.toLocaleLowerCase()
      if (previousEl && (name === 'i' || name === 'td')) {
        previousEl.style = ''
      }
      if (event.target.className === 'thisMonth') {
        event.target.style = 'background:#F8F8F8;color:#000'
        previousEl = event.target
      }
    }
  }

  //绑定颜色改变事件
  componentDidMount() {
    // let changeColor = this.changeColor()
    // document.getElementById('calendarContainer')
    //     .addEventListener('click', changeColor, false);

  }

  render() {
    //确定当前月数据中每一天所属的月份，以此赋予不同className
    let month = this.props.viewData[this.props.month],
      rowsInMonth = [],
      i = 0,
      styleOfDays = (() => {
        let i = month.indexOf(1),
          j = month.indexOf(1, i + 1),
          arr = new Array(42)
        arr.fill('prevMonth', 0, i)
        arr.fill('thisMonth', i, j)
        arr.fill('nextMonth', j)
        return arr
      })()

    //把每一个月的显示数据以7天为一组等分
    month.forEach((day, index) => {
      if (index % 7 === 0) {
        rowsInMonth.push(month.slice(index, index + 7))
      }
    })

    return (
      <table className="calendarMain">
        {/* <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead> */}
        <tbody>
        {
          rowsInMonth.map((row, rowIndex) => {
            //获取保存的当月选中信息
            return (
              <tr key={rowIndex}>
                {
                  row.map((day) => {
                    {/* 如果在收集到已选择的state且属于当前月里就显示红色 */
                    }
                    let _this = this
                    let showClass = (_this.props.selcetedDays.indexOf(day) == -1) ? '' : 'picked';
                    showClass = styleOfDays[i] == "thisMonth" ? showClass : '';
                    let isPointer = _this.props.stocks[day - 1] > 0 ? "pointer" : "";
                    {/* 小于今天不让点 */
                    }
                    let isBeforeToday;
                    if (styleOfDays[i] == "thisMonth") {
                      let today = moment(new Date()).format('YYYY-MM-DD');
                      let todayMs = moment(today).format('x');
                      let currentDay = _this.props.year + '-' + (_this.props.month + 1) + '-' + day;
                      let currentDayMs = moment(currentDay, 'YYYY-MM-DD').format('x');
                      {/* isBeforeToday = currentDayMs < todayMs ? 'beforeNow' : ''; */
                      }
                    }
                    {/* 是否在可选日期数组里 */
                    }
                    let isCanPick;
                    if (styleOfDays[i] == "thisMonth") {
                      let currentDay = _this.props.year + '-' + (_this.props.month + 1) + '-' + day;
                      let currentDayMs = moment(currentDay, 'YYYY-MM-DD').format('x');
                      {/* console.log(this.props.canPick) */
                      }
                      isCanPick = _this.props.canPick.indexOf(currentDayMs) > -1 ? 'canPick' : '';
                      // debugger
                    }
                    return (
                      <td className={styleOfDays[i] + ' ' + showClass + ' ' + isPointer + ' ' + isCanPick}
                          onClick={
                            _this.handleDatePick.bind
                            (_this, i, styleOfDays[i], _this.props.stocks[day - 1], isCanPick)}
                          key={i++}>
                        {day}
                        {/* {styleOfDays[i - 1] == "thisMonth" ? <div className={this.props.stocks[day - 1] > 0 ? null : css.noNumber}>{this.props.stocks[day - 1] + '张'}</div> : null} */}
                        {isCanPick ? <div>可选</div> : null}
                      </td>

                    )
                  })
                }
              </tr>
            )
          })
        }
        </tbody>
      </table>
    )
  }
}

export default CalendarMain
