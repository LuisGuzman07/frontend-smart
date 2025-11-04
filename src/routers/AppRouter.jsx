import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Importa tus páginas aquí (ajusta los paths según tu estructura real)
import LoginPage from "../pages/login/loginPage.jsx";
import RegisterPage from "../pages/register/registerPage.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import ClientePage from "../pages/cliente/clientePage.jsx";

import RolesPage from "../pages/roles/rolesPage.jsx";
import UserPage from "../pages/usuario/userPage.jsx";

import EmpleadoPage from "../pages/empleado/empleadoPage.jsx";
import CategoriaPage from "../pages/categoria/categoriaPage.jsx";
import ProductoPage from "../pages/producto/productoPage.jsx";
import BackupPage from "../pages/backup/backupPage.jsx";
import CarritoPage from "../pages/carrito/carritoPage.jsx";
import DetalleCarritoPage from "../pages/detallecarrito/detalleCarritoPage.jsx";
import PagoPage from "../pages/pago/pagoPage.jsx";
import PagoSuccessPage from "../pages/pago/pagoSuccessPage.jsx";
import HistorialVentasPage from "../pages/historialVentas/historialVentasPage.jsx";
import FacturaPage from "../pages/factura/facturaPage.jsx";
import FacturaDetalle from "../pages/factura/facturaDetalle.jsx";

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
					<Route path="/clientes" element={<ClientePage />} />
					<Route path="/administracion/empleado" element={<EmpleadoPage />} />
					<Route path="/administracion/rol" element={<RolesPage />} />
					<Route path="/administracion/usuario" element={<UserPage />} />
					<Route path="/productos/categoria" element={<CategoriaPage />} />
					<Route path="/productos/producto" element={<ProductoPage />} />
					<Route path="/carrito" element={<CarritoPage />} />
					<Route path="/detallecarrito" element={<DetalleCarritoPage />} />
					<Route path="/pago" element={<PagoPage />} />
					<Route path="/pago/success" element={<PagoSuccessPage />} />
					<Route path="/historial-ventas" element={<HistorialVentasPage />} />
					<Route path="/ventas/comprobantes" element={<FacturaPage />} />
					<Route path="/factura/:id" element={<FacturaDetalle />} />
					<Route path="/backup" element={<BackupPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
