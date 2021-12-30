function Auth() {
	let url = new URL("https://accounts.spotify.com/authorize");
	url.searchParams.append("client_id", "f4001ac9efb949f6a80ef0fb3633d868")
	url.searchParams.append("response_type", "token");
	url.searchParams.append("redirect_uri", process.env.NODE_ENV === "production" ? "http://replay.mogery.me/callback" : "http://localhost:3000/callback");
	url.searchParams.append("scope", "playlist-read-private playlist-modify-public playlist-modify-private user-top-read user-follow-read")

	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
	let state = new Array(32).fill(0).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")
	url.searchParams.append("state", state);
	localStorage.setItem("spotify_auth_state", state);

	window.location.href = url.toString();
}

export default Auth;