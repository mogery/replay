import { useEffect } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";

import AppCreate from "./Create";
import AppRoot from "./Root";
import { useAuth } from "../../auth";
import spotify from "../../spotify";
import AppDone from "./Done";

function AppRouter() {
    let auth = useAuth();

    useEffect(() => {
        (async function checkTokenValidity() {
            try {
                await spotify.getMe();
            } catch (e) {
                console.log(e);
                auth.signOut();
            }
        })();
    }, []);

    let { path } = useRouteMatch();

    if (!auth.token) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <Switch>
            <Route
                path={path} exact
                component={AppRoot}
            />
            <Route
                path={`${path}/create`} exact
                component={AppCreate}
            />
            <Route
                path={`${path}/done`} exact
                component={AppDone}
            />
        </Switch>
    )
}

export default AppRouter;