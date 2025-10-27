import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Importa tus páginas aquí (ajusta los paths según tu estructura real)
import LoginPage from "../pages/login/loginPage.jsx";
import RegisterPage from "../pages/register/registerPage.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";

// Ejemplo de layout, dashboard y otras páginas (puedes agregar más según tu proyecto)
// import Layout from "../pages/layout";
// import Dashboard from "../pages/dashboard/dashboard.jsx";

const AdminRoutes = () => {
	const isAuthenticated = !!localStorage.getItem("access");
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	// Aquí puedes envolver con Layout si tienes uno
	return <Outlet />;
};

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				{/* Ruta protegida para el dashboard */}
				<Route element={<AdminRoutes />}>
					<Route path="/admin/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
