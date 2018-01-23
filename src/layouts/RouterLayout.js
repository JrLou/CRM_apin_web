import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'dva/router';
import AuthRoute from '../auth/AuthRoute';
import { getRoutes } from '../utils/utils';
import NotFound from '../routes/Exception/404';
class RouterLayout extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
  render() {
    const { routerData, redirectData, match } = this.props
    return (
      <div style={{ minHeight: 'calc(100vh - 260px)' }}>
        <Switch>
          {
            redirectData.map(item =>
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            )
          }
          <Redirect exact from="/" to="/welcome" />
          {
            getRoutes(match.path, routerData).map(Item => (
              <Route
                key={Item.key}
                path={Item.path}
                component={this.props.env ? Item.component : AuthRoute(Item.component, Item.path)}
                exact={Item.exact}
              />
            ))
          }
          <Route render={NotFound} />
        </Switch>
      </div>
    )
  }
}

export default RouterLayout;
