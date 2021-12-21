import { Route, Switch, Redirect } from 'react-router-dom';
import PermissionsGate from './PermissionGate';

const ROUTES: any = [];

export default ROUTES;

function RouteWithSubRoutes(route: any) {
    return (
        <Route
            key={route.key}
            path={route.path}
            exact={route.exact}
            render={props => <route.component {...props} routes={route.routes} />}
        />
    );
};

export function RenderRoutes(routesObj: any) {
    const { routes } = routesObj;
    return (
        <Switch>
            {routes.map((route: any) => {
                return <RouteWithSubRoutes key={route.key} {...route} />
            })}
        </Switch>
    );
};