import { useAuth } from "../auth";
import { Redirect } from "react-router";

function Callback({ location }) {
    let auth = useAuth();

    let params = new URLSearchParams(location.hash.slice(1));
    let accessToken = params.get("access_token")
    let state = params.get("state");

    let savedState = localStorage.getItem("spotify_auth_state");
    localStorage.removeItem("spotify_auth_state");

    if (state !== savedState) {
        return (
            <Redirect
                to={{
                    pathname: "/",
                    state: { error: "Failed to auth: Invalid state." }
                }}
            />
        )
    }

    auth.signIn(accessToken);
    
    return (
        <Redirect to="/app" />
    )
}

export default Callback;