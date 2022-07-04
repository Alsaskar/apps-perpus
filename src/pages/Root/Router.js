import {
    Switch,
    Route
} from "react-router-dom";
import { useNav } from './hoc'
import FourOFour from "../404";

const Router = () => {
    const navigation = useNav("/");
    return (
        <Switch>
            {
                navigation.items &&
                navigation.items.map((item, idx) => (
                <Route
                    exact={item.exact}
                    key={`${item.path}_${idx}`}
                    path={`${item.path}`}
                    component={item.component}
                />
                ))
            }
            <Route path="/" component={FourOFour} />
        </Switch>
    )
}  

export default Router