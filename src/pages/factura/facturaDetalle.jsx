import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFacturaById } from '../../api/facturaApi';
import { getDetallesByFacturaId } from '../../api/detallefacturaApi';
import Sidebar from '../../components/sidebar';

const FacturaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // Cargar factura y detalles en paralelo
            const [facturaData, detallesData] = await Promise.all([
                getFacturaById(id),
                getDetallesByFacturaId(id)
            ]);

            console.log('📄 Factura:', facturaData);
            console.log('📦 Detalles:', detallesData);

            setFactura(facturaData);
            setDetalles(Array.isArray(detallesData) ? detallesData : []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los detalles de la factura');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
            pagada: "bg-green-100 text-green-800 border-green-300",
            anulada: "bg-gray-100 text-gray-800 border-gray-300"
        };
        
        const labels = {
            pendiente: "⏳ Pendiente",
            pagada: "✓ Pagada",
            anulada: "⊘ Anulada"
        };

        return (
            <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${badges[estado] || badges.pendiente}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando detalles...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !factura) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
                        <p className="text-red-800 text-center">{error || 'Factura no encontrada'}</p>
                        <button
                            onClick={() => navigate('/ventas/comprobantes')}
                            className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Volver a Comprobantes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">📄 Detalle de Factura</h1>
                            <p className="text-gray-600 mt-1">Información completa de la factura</p>
                        </div>
                        <button
                            onClick={() => navigate('/ventas/comprobantes')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            ← Volver
                        </button>
                    </div>

                    {/* Información de la Factura */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{factura.numero_comprobante}</h2>
                                <p className="text-gray-600">Factura {factura.tipo_comprobante || 'Comercial'}</p>
                            </div>
                            {getEstadoBadge(factura.estado)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del Cliente */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg text-gray-900 mb-3">👤 Cliente</h3>
                                <div>
                                    <p className="text-sm text-gray-600">Nombre</p>
                                    <p className="font-medium text-gray-900">{factura.cliente_nombre || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">CI/NIT</p>
                                    <p className="font-medium text-gray-900">{factura.cliente_ci || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Información de la Factura */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg text-gray-900 mb-3">📋 Información</h3>
                                <div>
                                    <p className="text-sm text-gray-600">Fecha de Emisión</p>
                                    <p className="font-medium text-gray-900">{formatDate(factura.fecha)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Método de Pago</p>
                                    <p className="font-medium text-gray-900">{factura.metodo_pago || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de Productos */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                            <h3 className="text-xl font-bold">📦 Productos de la Factura</h3>
                        </div>

                        {detalles.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No hay productos en esta factura
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cantidad
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio Unit.
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descuento
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subtotal
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Impuesto
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {detalles.map((detalle) => {
                                            // Calcular precio unitario desde el subtotal
                                            const precioUnitario = detalle.cantidad > 0 
                                                ? (parseFloat(detalle.subtotal) / detalle.cantidad).toFixed(2)
                                                : 0;

                                            return (
                                                <tr key={detalle.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {detalle.codigo || detalle.producto_codigo || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {detalle.producto_nombre || 'Producto eliminado'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                                                        {detalle.cantidad}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                                        Bs. {precioUnitario}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
                                                        {detalle.descuento > 0 ? `${detalle.descuento}%` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                                        Bs. {parseFloat(detalle.subtotal).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                                        Bs. {parseFloat(detalle.impuesto).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600">
                                                        Bs. {parseFloat(detalle.total).toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Totales */}
                        <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
                            <div className="max-w-md ml-auto space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Subtotal:</p>
                                    <span className="font-medium text-gray-900">
                                        Bs. {parseFloat(factura.subtotal || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Impuesto (13%):</span>
                                    <span className="font-medium text-gray-900">
                                        Bs. {parseFloat(factura.impuesto || 0).toFixed(2)}
                                    </span>
                                </div>
                                {factura.monto_descuento > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-600">Descuento:</span>
                                        <span className="font-medium text-orange-600">
                                            - Bs. {parseFloat(factura.monto_descuento).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-3">
                                    <span className="text-gray-900">TOTAL:</span>
                                    <span className="text-indigo-600">
                                        Bs. {parseFloat(factura.total || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={() => window.print()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            🖨️ Imprimir Factura
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacturaDetalle;
