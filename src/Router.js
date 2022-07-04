import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from './pages/Login'
import Register from "./pages/Register";
import Root from './pages/Root'

const Router = () => {
    return(
        <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/regis" exact component={Register} />
            <PrivateRoute path="/" component={Root} />
        </Switch>
    )
}

export default Router