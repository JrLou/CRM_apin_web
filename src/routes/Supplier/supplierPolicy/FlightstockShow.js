/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Col,
  Row,
} from 'antd';
import css from './Flightstock.less';
import moment from 'moment';

class page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {accurate} = this.props;
    return (
      <div className={css.flightList}>
        <Row>
          <Col span={24}>
            <Col span={24} className={css.selectbContent}>
              <Col span={24}>
                <Col span={24} style={{fontSize: '20px', color: "rgb(0, 0, 0)"}}>{accurate.FlightNo}</Col>
              </Col>
              <Col span={accurate.stopFlag == 1 ? 11 : 12}>
                <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{accurate.FlightDep}</Col>
                <Col span={24}>{accurate.FlightDepAirport}</Col>
                <Col span={24}>{accurate.FlightDepcode}</Col>
                <Col span={24}>{moment(accurate.FlightDeptimePlanDate).format("HH:mm:ss")}</Col>
              </Col>
              {accurate.StopFlag == 1 &&
              <Col span={2} style={{fontSize: '16px'}}>
                经停
              </Col>
              }
              <Col span={accurate.StopFlag == 1 ? 11 : 12}>
                <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{accurate.FlightArr}</Col>
                <Col span={24}>{accurate.FlightArrAirport}</Col>
                <Col span={24}>{accurate.FlightArrcode}</Col>
                <Col span={24}>{moment(accurate.FlightArrtimePlanDate).format('HH:mm:ss')}</Col>
              </Col>
            </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = page;
