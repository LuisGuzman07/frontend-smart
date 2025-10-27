import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSmart from "../../assets/logosmart.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const username = localStorage.getItem("username") || "Usuario";
  const userRole = localStorage.getItem("userRole") || "Invitado";

  // Simulación de datos para las tarjetas y la tabla
  const statsData = [
    { label: "Ventas", value: 120, icon: "💰", color: "bg-blue-100" },
    { label: "Clientes", value: 45, icon: "👥", color: "bg-green-100" },
    { label: "Pedidos", value: 32, icon: "📦", color: "bg-yellow-100" },
    { label: "Empleados", value: 8, icon: "🧑‍💼", color: "bg-indigo-100" },
  ];
  const recentOrders = [
    { id: 1, cliente: "Juan Pérez", fecha: "2025-10-25", estado: "Completado", monto: "$120.00" },
    { id: 2, cliente: "Ana Gómez", fecha: "2025-10-26", estado: "En proceso", monto: "$80.00" },
    { id: 3, cliente: "Carlos Ruiz", fecha: "2025-10-27", estado: "Enviado", monto: "$150.00" },
  ];

  const handleLogout = () => {
    // Aquí va la lógica de logout
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header de la barra lateral */}
        <div className="p-4 flex flex-col items-center justify-center border-b border-gray-700">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col items-center justify-center w-full">
              {isSidebarOpen && (
                <>
                  <img src={logoSmart} alt="Logo Smart Sales 365" style={{ width: "120px", marginBottom: "0.5rem" }} />
                  <p className="text-xs text-gray-400">Sistema de Gestión Comercial</p>
                </>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white ml-2"
            >
              ☰
            </button>
          </div>
        </div>
        {/* Menú de navegación */}
        <nav className="flex-1 py-4">
          <MenuItem icon="🏠" label="Dashboard" active={true} isOpen={isSidebarOpen} onClick={() => navigate("/admin/dashboard")} />
          <MenuItem icon="👥" label="Clientes" isOpen={isSidebarOpen} onClick={() => navigate("/clientes")} />
          <MenuItem icon="📦" label="Catálogo" isOpen={isSidebarOpen} onClick={() => navigate("/catalogo")} />
          <MenuItem icon="💸" label="Ventas" isOpen={isSidebarOpen} onClick={() => navigate("/ventas")} />
          <MenuItem icon="📊" label="Analítica" isOpen={isSidebarOpen} onClick={() => navigate("/analitica")} />
          <MenuItem icon="⚙️" label="Administración" isOpen={isSidebarOpen} onClick={() => navigate("/administracion")} />
        </nav>
        {/* Perfil y Logout */}
        <div className="border-t border-gray-700 p-4">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <img
                src={`https://ui-avatars.com/api/?name=${username}&background=4F46E5&color=fff&size=40`}
                alt="avatar"
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`${isSidebarOpen ? "w-full" : "w-full"} bg-red-600 hover:bg-red-700 py-2 px-3 rounded transition flex items-center justify-center gap-2`}
          >
            <span>🚪</span>
            {isSidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header principal sin logo */}
        <header className="bg-white shadow-sm p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>
        {/* Contenido */}
        <div className="p-6">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsData.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-lg shadow p-6 transform hover:scale-105 transition-transform`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl opacity-80">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Gráficos placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>📈</span> Predicción de Ventas (IA)
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-lg font-medium">Gráfico de Predicción de Ventas</p>
                  <p className="text-sm">(líneas, barras, comparativas)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>👥</span> Análisis de Clientes
              </h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-lg font-medium">Distribución de Clientes</p>
                  <p className="text-sm">(por categoría y comportamiento)</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tabla de últimas órdenes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>📋</span> Últimos Pedidos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.estado === "Completado" ? "bg-green-100 text-green-800" :
                          order.estado === "Enviado" ? "bg-blue-100 text-blue-800" :
                          order.estado === "En proceso" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {order.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{order.monto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente para los items del menú
const MenuItem = ({ icon, label, active = false, isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition ${
        active ? "bg-gray-700 border-l-4 border-blue-500" : ""
      }`}
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};

export default Dashboard;
