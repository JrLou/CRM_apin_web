/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Col, Row, Card, Icon } from 'antd';
import css from './FlightCard.less';
import moment from 'moment';

class FlightCard extends Component {
    constructor(props) {
        super(props);
    }
    changeTime(originDate) {
        return moment(originDate, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
    }
    render() {

        return (
            this.props.visiable ?
                <div className={css.cardContainer}>
                    <Card title="" bordered={false} className={css.cardOut}>
                        <Row>
                            <Col span={24} offset={0}>
                                <Col span={11}>
                                    <div className={css.cardTop} style={{ textAlign: "right" }}>
                                        <span className={css.city}>{this.props.cardData.FlightDep}</span>
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className={css.cardTop}>
                                        <Icon style={{ fontSize: 22 }} type="swap-right" />
                                    </div>
                                </Col>
                                <Col span={11}>
                                    <div className={css.cardTop} style={{ textAlign: "left" }}>
                                        <span className={css.city}>{this.props.cardData.FlightArr}</span>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <div className={css.companyBox}>
                            <span className={css.company}>{this.props.cardData.FlightCompany}</span>
                            <span className={css.company}>{this.props.cardData.FlightNo}</span>
                        </div>
                        <Row>
                            <Col span={24} offset={0}>
                                <Col span={9}>
                                    <div className={css.cardDiv}>
                                        <div className={css.airportL}>{this.props.cardData.FlightDepAirport}</div>
                                        <div className={css.flyTimeL}>{this.changeTime(this.props.cardData.FlightDeptimePlanDate)}</div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className={css.cardDiv}>
                                        <div style={{ lineHeight: 1.5 }} className={css.planeBox}> {this.props.cardData.StopFlag ? '经停' : null}</div>
                                    </div>
                                </Col>
                                <Col span={9}>
                                    <div className={css.cardDiv}>
                                        <div className={css.airportR}>{this.props.cardData.FlightArrAirport}</div>
                                        <div className={css.flyTimeR}>{this.changeTime(this.props.cardData.FlightArrtimePlanDate)}</div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </Card>
                </div>
                : null
        )
    }
}
export default FlightCard
FlightCard.defaultProps = {
    cardData: {
        FlightDepAirport: "",
        FlightDep: "",
        FlightDeptimePlanDate: "",
        FlightNo: "",
        FlightArrAirport: "",
        FlightArr: "",
        FlightArrtimePlanDate: "",
        FlightCompany: ''
    }
}

