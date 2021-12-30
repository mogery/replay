import { createContext, useState, useContext, useEffect } from "react";
import spotify from "./spotify";
export const authContext = createContext();

export function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return (
		<authContext.Provider value={auth}>
			{children}
		</authContext.Provider>
	);
}

export function useAuth() {
	return useContext(authContext);
}

function useProvideAuth() {
	const [token, setToken] = useState(JSON.parse(localStorage.getItem("access_token") || 'null'));
	spotify.setAccessToken(token);

	useEffect(() => {
		spotify.setAccessToken(token);
		localStorage.setItem("access_token", JSON.stringify(token));
	}, [token]);

	const signIn = token => {
		setToken(token);
	};

	const signOut = () => {
		setToken(null);
	};

	return {
		token,
		signIn,
		signOut
	};
}