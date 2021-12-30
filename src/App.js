import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Landing from "./routes/Landing";
import Auth from "./routes/Auth";
import Callback from "./routes/Callback";
import AppRouter from "./routes/app";
import { ProvideAuth } from "./auth";

function App() {
	return (
		<ProvideAuth>
			<BrowserRouter>
				<Switch>
					<Route
						path="/" exact
						component={Landing}
					/>
					<Route
						path="/auth" exact
						component={Auth}
					/>
					<Route
						path="/callback" exact
						component={Callback}
					/>
					<Route
						path="/app"
						component={AppRouter}
					/>
				</Switch>
			</BrowserRouter>
		</ProvideAuth>
	)
}

export default App;