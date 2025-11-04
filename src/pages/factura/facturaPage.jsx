import React from 'react';
import Sidebar from '../../components/sidebar';
import FacturaList from './facturaList';

const FacturaPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🧾 Visualizar Comprobantes</h1>
                            <p className="text-gray-600 mt-1">Consulta todas las facturas generadas en el sistema</p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <FacturaList />

                    {/* Información adicional */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-blue-800">
                                Este módulo muestra todas las facturas del sistema (pendientes, pagadas y anuladas). 
                                Para ver solo las ventas completadas con información de pago, consulta el 
                                <strong> Historial de Ventas</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacturaPage;
