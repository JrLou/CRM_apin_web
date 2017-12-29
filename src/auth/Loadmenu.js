import React from 'react'
import { Spin } from 'antd';
import { connect } from 'dva';
export default (WrappedComponent, props) => {
  class Loadmenu2 extends React.Component {
    // constructor(props) {
    //   super(props);
    //   // this.state = {
    //   //   load:this.props.menusload
    //   // }
    // }
    componentDidMount() {
      this.props.menusload||this.props.dispatch({
        type: 'global/fetchMenus',
      });
    }
    render() {
      console.log(1111)
      return this.props.menusload?<WrappedComponent {...props} />: <Spin size="large" style={{ width: "100%",margin: "40px 0 !important"}} />
    }
  }
  const A = connect(state => ({
    menusload: state.global.menusload,
  }))(Loadmenu2)
  return <A />
}

// export default connect(state => ({
//   currentUser: state.user.currentUser,
//   collapsed: state.global.collapsed,
//   fetchingNotices: state.global.fetchingNotices,
//   notices: state.global.notices,
// }))(Loadmenu);
{/* <Spin size="large" className={styles.globalSpin} />; */}
