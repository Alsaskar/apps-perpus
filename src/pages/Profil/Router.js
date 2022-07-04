import { useNav } from '../Root/hoc'
import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router'
import FourOFour from '../404'

const Router = () => {
  const { path } = useRouteMatch();
  const navigation = useNav(path);

  return (
    <Switch>
      {navigation.items.map((item) => (
        <Route
          exact={item.exact}
          key={item.path}
          path={`${item.path}`}
          component={item.component}
        />
      ))}
      <Route component={FourOFour} />
    </Switch>
  )
}

export default Router