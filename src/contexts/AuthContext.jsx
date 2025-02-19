import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Handle OAuth callback
		if (location.pathname === "/auth/callback") {
			const params = new URLSearchParams(location.search);
			const token = params.get("token");
			const error = params.get("error");

			if (token) {
				console.log("Setting token from callback:", token);
				localStorage.setItem("token", token);
				// Decode token to get user info
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					setUser(payload);
					navigate("/chat");
				} catch (error) {
					console.error("Error decoding token:", error);
					navigate("/login");
				}
			} else if (error) {
				setError(error);
				navigate("/login");
			}
		}
	}, [location]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log("Initial token check:", token); // Debug log
		if (token) {
			fetchUser();
		} else {
			setLoading(false);
		}
	}, []);

	const fetchUser = async () => {
		const token = localStorage.getItem("token");
		console.log("Fetching user with token:", token);
		try {
			const data = await authAPI.getMe();
			console.log("User data received:", data);
			setUser(data);
		} catch (error) {
			console.error("Fetch user error:", error);
			localStorage.removeItem("token");
			setUser(null);
			navigate("/login");
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await authAPI.login(email, password);
			console.log("Login response:", response); // Debug log
			localStorage.setItem("token", response.token);
			setUser(response.user);
			return response; // Ensure this returns the response
		} catch (error) {
			console.error("Login error:", error);
			setError(error.response?.data?.message || "Login failed");
			throw error; // Ensure the error is thrown for handling in the component
		}
	};

	const signup = async (username, email, password) => {
		try {
			setError(null);
			const data = await authAPI.signup(username, email, password);
			localStorage.setItem("token", data.token);
			setUser(data.user);
		} catch (error) {
			setError(error.response?.data?.message || "Signup failed");
			throw error;
		}
	};

	const loginWithGithub = () => {
		const githubUrl = authAPI.getGithubAuthUrl();
		console.log("Redirecting to GitHub:", githubUrl); // Debug log
		window.location.href = githubUrl;
	};

	const loginWithGoogle = () => {
		window.location.href = authAPI.getGoogleAuthUrl();
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		navigate("/login");
	};

	const value = {
		user,
		error,
		loading,
		login,
		signup,
		logout,
		loginWithGithub,
		loginWithGoogle,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
