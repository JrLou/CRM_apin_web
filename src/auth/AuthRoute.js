import React from 'react'
import { Spin } from 'antd';
import { connect } from 'dva';
import NotAuth from '../routes/Exception/403';
import { Route } from 'dva/router'
export default ({ component: Component, ...rest }) => {
  class AuthRoute extends React.Component {
    // constructor(props) {
    //   super(props);
    //   // this.state = {
    //   //   load:this.props.menusload
    //   // }
    // }
    // componentDidMount() {
    //   this.props.menusload||this.props.dispatch({
    //     type: 'global/fetchMenus',
    //   });
    // }
    render() {
      const Auth = this.props.menus.some(item => item && item.path && item.path == rest.path)
      return <Route {...rest} render={props => (
        !null ? (
          <Component {...props} />
        ) : <NotAuth />
      )} />
    }
  }
  const A = connect(state => ({
    menus: state.global.menus,
  }))(AuthRoute)
  return <A />
}

// export default connect(state => ({
//   currentUser: state.user.currentUser,
//   collapsed: state.global.collapsed,
//   fetchingNotices: state.global.fetchingNotices,
//   notices: state.global.notices,
// }))(Loadmenu);
{/* <Spin size="large" className={styles.globalSpin} />; */ }
