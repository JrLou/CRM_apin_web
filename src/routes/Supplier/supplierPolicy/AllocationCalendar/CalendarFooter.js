import React, { Component } from 'react'
import { Button } from 'antd'

class CalendarFooter extends Component {
    handlePick() {
        // this.props.datePickerToggle()
        this.props.showCalendar()
    }

    render() {
        return (
            <div className="calendarFooter">
                <Button
                    type="primary"
                    onClick={this.handlePick.bind(this)}>
                    确定
                </Button>
            </div >
        )
    }


}

export default CalendarFooter