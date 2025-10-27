import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./loginform";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
	const { login, loading, error } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login(username, password);
		if (success) {
			console.log("✅ Login exitoso");
			navigate("/admin/dashboard");
		}
	};

	return (
		<LoginForm
			username={username}
			password={password}
			setUsername={setUsername}
			setPassword={setPassword}
			onSubmit={handleSubmit}
			loading={loading}
			error={error}
		/>
	);
};

export default LoginPage;

