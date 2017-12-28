import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import CookieHelp from './utils/cookies';
import styles from './index.less';
import request from './utils/request';
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

const fakeAuth = ()=>{
  return CookieHelp.getUserInfo();
}
//请求菜单数据
const Loadmenu = ()=>{
  return request('/crm/uc/authapi/v1.1/modules?');
}
const PrivateRoute = ({ component : Component , ...rest}) => {
  return (
    <Route path={rest.path} render={
      (props) => {
        if(fakeAuth()){
          Loadmenu()

          return  <Component {...props} {...rest}/>
        }else{
          return <Redirect to={{
                    pathname: '/user/login',
                    state: { from: rest.location }
                  }} />
        }
      }
    } />
  )
}


function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} />} />
          <PrivateRoute path="/" component={BasicLayout}/>
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
