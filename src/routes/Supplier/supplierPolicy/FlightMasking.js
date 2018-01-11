import React, {Component} from 'react'
import { DatePicker, Checkbox,} from 'antd'
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;
import css from './Flightstock.less';

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
  getDate(datestr) {
    var temp = datestr.split("/");
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
  }

  render() {


    return (
      <div>
        {!this.state.visible &&
        <ul className={css.events}>
          {
            this.props.listData.list.map(function (item) {
              return (
                <li key={item.content}>
                  {item.type ? <span className={css[`event-${item.type}`]}>●</span> : <span></span>}
                  {item.content == "暂无班期" ? <span className={css.air}>{item.content}</span> :
                    <span className={css.event}>{item.content}</span>}
                  <span style={{fontSize: '16px', lineHeight: '11PX'}}> {item.price}</span>
                </li>
              )
            })
          }
        </ul>
        }

      </div>
    )
  }
}

export default Masking
