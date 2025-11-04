import api from './axiosConfig';

const API_URL = '/api/transacciones/historial-ventas/';

/**
 * API para gestionar el Historial de Ventas
 */

// Obtener todas las ventas con filtros opcionales
export const getHistorialVentas = async (params = {}) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener historial de ventas:', error);
        throw error;
    }
};

// Obtener detalle de una venta específica
export const getHistorialVentaDetalle = async (id) => {
    try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle de venta:', error);
        throw error;
    }
};

// Obtener estadísticas generales
export const getEstadisticasVentas = async (fechaInicio = null, fechaFin = null) => {
    try {
        const params = {};
        if (fechaInicio) params.fecha_inicio = fechaInicio;
        if (fechaFin) params.fecha_fin = fechaFin;
        
        const response = await api.get(`${API_URL}estadisticas/`, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
};

// Obtener ventas de un cliente específico
export const getVentasPorCliente = async (clienteCi) => {
    try {
        const response = await api.get(`${API_URL}por_cliente/`, {
            params: { ci: clienteCi }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ventas por cliente:', error);
        throw error;
    }
};

// Obtener ventas por rango de fechas
export const getVentasPorFecha = async (fechaInicio, fechaFin) => {
    try {
        const response = await api.get(`${API_URL}por_fecha/`, {
            params: { inicio: fechaInicio, fin: fechaFin }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ventas por fecha:', error);
        throw error;
    }
};

// Obtener ventas recientes
export const getVentasRecientes = async (limit = 10) => {
    try {
        const response = await api.get(`${API_URL}recientes/`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ventas recientes:', error);
        throw error;
    }
};

// Actualizar estado de pago
export const actualizarEstadoPago = async (id, estadoPago) => {
    try {
        const response = await api.post(`${API_URL}${id}/actualizar_estado/`, {
            estado_pago: estadoPago
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado de pago:', error);
        throw error;
    }
};

// Anular una venta
export const anularVenta = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/anular/`);
        return response.data;
    } catch (error) {
        console.error('Error al anular venta:', error);
        throw error;
    }
};

// Crear registro histórico desde factura
export const crearDesdeFactura = async (facturaId) => {
    try {
        const response = await api.post(`${API_URL}crear_desde_factura/`, {
            factura_id: facturaId
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear registro histórico:', error);
        throw error;
    }
};

// Obtener resumen por estado de pago
export const getResumenPorEstado = async () => {
    try {
        const response = await api.get(`${API_URL}por_estado/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener resumen por estado:', error);
        throw error;
    }
};

// Obtener top clientes
export const getTopClientes = async (limit = 10) => {
    try {
        const response = await api.get(`${API_URL}top_clientes/`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener top clientes:', error);
        throw error;
    }
};

// Limpiar todos los datos de prueba (solo para desarrollo/demo)
export const limpiarDatosPrueba = async () => {
    try {
        // Obtener todas las ventas del historial
        const ventas = await getHistorialVentas();
        const ventasArray = Array.isArray(ventas) ? ventas : ventas.results || [];
        
        console.log(`🗑️ Eliminando ${ventasArray.length} registros...`);
        
        // Eliminar las FACTURAS (el historial se elimina en cascada)
        for (const venta of ventasArray) {
            try {
                // Eliminar la factura - esto eliminará automáticamente el historial en cascada
                await api.delete(`/api/transacciones/factura/${venta.factura}/`);
                console.log(`✅ Factura ${venta.numero_venta} eliminada`);
            } catch (err) {
                console.error(`❌ Error al eliminar factura ${venta.numero_venta}:`, err);
            }
        }
        
        return { 
            message: 'Datos de prueba eliminados correctamente',
            eliminados: ventasArray.length
        };
    } catch (error) {
        console.error('Error al limpiar datos de prueba:', error);
        throw error;
    }
};

export default {
    getHistorialVentas,
    getHistorialVentaDetalle,
    getEstadisticasVentas,
    getVentasPorCliente,
    getVentasPorFecha,
    getVentasRecientes,
    actualizarEstadoPago,
    anularVenta,
    crearDesdeFactura,
    getResumenPorEstado,
    getTopClientes,
    limpiarDatosPrueba
};
