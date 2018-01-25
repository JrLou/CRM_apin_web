import React, { PureComponent } from "react";
import { connect } from "dva";
import Page from "../CustomerMannagement/Template";

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
export default class TableList extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "customerMannagement/extendAll",
      payload: { pageType: "s" },
    });
  }
  render() {
    return <Page />;
  }
}
