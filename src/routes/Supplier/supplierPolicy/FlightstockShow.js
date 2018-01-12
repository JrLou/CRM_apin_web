/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Col,
  Row,
} from 'antd';
import css from './Flightstock.less';


class page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const {accurate, numbering} = this.props;
    return (
      <div className={css.flightList}>
        <Row>
          <Col span={24}>
              <Col span={21} className={css.selectbContent}>
                <Col span={24}>
                  <Col span={24} style={{fontSize: '20px', color: "rgb(0, 0, 0)"}}>{v.FlightNo}</Col>
                </Col>
                <Col span={v.stopFlag ? 11 : 12}>
                  <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{v.FlightDep}</Col>
                  <Col span={24}>{v.FlightDepAirport}</Col>
                  <Col span={24}>{v.FlightDepcode}</Col>
                  <Col span={24}>{v.FlightDeptimePlanDate}</Col>
                </Col>
                {v.stopFlag &&
                <Col span={2} style={{fontSize: '16px'}}>
                  经停
                </Col>
                }
                <Col span={v.stopFlag ? 11 : 12}>
                  <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{v.FlightArr}</Col>
                  <Col span={24}>{v.FlightArrAirport}</Col>
                  <Col span={24}>{v.FlightArrcode}</Col>
                  <Col span={24}>{v.FlightArrtimePlanDate}</Col>
                </Col>
              </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = page;
