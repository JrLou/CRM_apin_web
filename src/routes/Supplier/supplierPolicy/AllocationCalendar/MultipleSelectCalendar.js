/**
 * Created by ylb on 17/08/31.
 */
import React, {Component} from 'react'
import {Modal} from 'antd';
import css from './MultipleSelectCalendar.less';
import MyCalendar from './Calendar'

class MultipleSelectCalendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showTitle: '请选择'
    };
  }

  showCalendar() {
    this.setState({visible: !this.state.visible})
  }

  getPickInfo(pickInfo) {
    this.props.upPickInfo(pickInfo)
  }

  resetCalendar() {
    this.inner && this.inner.resetCalendar()
  }

  updateMonthStock(obj, ole) {
    this.props.updateMonthStock(obj, ole)
  }

  render() {
    return (
      <span>
                <span className={css.wrapper} onClick={this.showCalendar.bind(this)}>
                    <div>
                        <input
                          style={{width: '304px'}}
                          readOnly={true} value="" placeholder={this.props.placeholder}
                          className="ant-calendar-picker-input ant-input ant-input-lg"/>

                        <span className="ant-calendar-picker-icon">
                        </span>
                    </div>
                </span>
                <Modal
                  closable={false}
                  visible={this.state.visible}
                  footer={null}
                  onOk={this.showCalendar.bind(this)}
                  onCancel={this.showCalendar.bind(this)}
                  width={this.props.width}
                >
                    <MyCalendar
                      ref={calendar => this.inner = calendar}
                      year={this.props.year}
                      month={this.props.month}
                      day={this.props.day}
                      currenMonthStocks={this.props.currenMonthStocks}
                      updateMonthStock={this.updateMonthStock.bind(this)}
                      canPick={this.props.canPick}
                      toogleShow={this.showCalendar.bind(this)}
                      getPickInfo={this.getPickInfo.bind(this)}/>
                </Modal>
            </span>
    )
  }
}

export default MultipleSelectCalendar
MultipleSelectCalendar.defaultProps = {
  width: "500px"
}
