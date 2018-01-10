import React from 'react';
import { Switch, Link, Route,Redirect} from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import { getRoutes } from '../utils/utils';

const copyright = <div>Copyright <Icon type="copyright" />爱拼机</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '爱拼机';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 爱拼机`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>爱拼机</span>
              </Link>
            </div>
            <div className={styles.desc}>爱拼后台运营管理系统登录页面</div>
          </div>
          <Switch>
            {
              getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )
            }
            <Redirect exact from="/user" to="/user/login" />
            {/* <Route render={NotFound} /> */}
          </Switch>
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
