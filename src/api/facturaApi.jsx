import api from './axiosConfig';

const API_URL = '/api/transacciones/factura/';

/**
 * API para gestionar Facturas
 */

// Obtener todas las facturas
export const getFacturas = async (params = {}) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        throw error;
    }
};

// Obtener una factura por ID
export const getFacturaById = async (id) => {
    try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener factura:', error);
        throw error;
    }
};

// Crear una nueva factura
export const createFactura = async (facturaData) => {
    try {
        const response = await api.post(API_URL, facturaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear factura:', error);
        throw error;
    }
};

// Crear factura desde carrito
export const createFacturaFromCarrito = async (carritoId) => {
    try {
        // Primero obtener el carrito con sus detalles
        const carritoResponse = await api.get(`/api/inventario/carritos/${carritoId}/`);
        const carrito = carritoResponse.data;

        console.log('📦 Carrito obtenido:', carrito);
        console.log('👤 Cliente del carrito:', carrito.cliente);

        // Obtener el ID del cliente (puede venir como objeto o como ID)
        let clienteId;
        if (typeof carrito.cliente === 'object' && carrito.cliente !== null) {
            clienteId = carrito.cliente.id;
        } else {
            clienteId = carrito.cliente;
        }

        if (!clienteId) {
            throw new Error('El carrito no tiene un cliente asignado');
        }

        console.log('🆔 ID del cliente:', clienteId);

        // Generar número de comprobante único
        const numeroComprobante = `FAC-${Date.now()}-${carritoId}`;

        // Crear la factura
        const facturaData = {
            numero_comprobante: numeroComprobante,
            cliente: clienteId,
            estado: 'pendiente',
            monto_descuento: 0.00,
        };

        console.log('📝 Datos de la factura a crear:', facturaData);

        const facturaResponse = await api.post(API_URL, facturaData);
        const factura = facturaResponse.data;

        console.log('✅ Factura creada:', factura);

        // Crear los detalles de la factura desde los detalles del carrito
        if (carrito.detalles && carrito.detalles.length > 0) {
            console.log('📦 Creando detalles de factura...');
            
            for (const detalleCarrito of carrito.detalles) {
                // Obtener el ID del producto
                const productoId = typeof detalleCarrito.producto === 'object' 
                    ? detalleCarrito.producto.id 
                    : detalleCarrito.producto;

                // Solo enviar los campos que el modelo acepta
                const detalleData = {
                    factura: factura.id,
                    producto: productoId,
                    cantidad: parseInt(detalleCarrito.cantidad),
                    descuento: 0.00  // Descuento por defecto
                };

                console.log('📝 Creando detalle:', detalleData);

                await api.post('/api/transacciones/detalle-factura/', detalleData);
            }
            
            console.log('✅ Todos los detalles creados');
        }

        // Recalcular totales de la factura
        await api.post(`${API_URL}${factura.id}/recalcular/`);

        // Obtener la factura actualizada con los detalles
        const facturaActualizada = await api.get(`${API_URL}${factura.id}/`);
        console.log('✅ Factura creada exitosamente:', facturaActualizada.data);
        return facturaActualizada.data;
    } catch (error) {
        console.error('❌ Error al crear factura desde carrito:', error);
        console.error('Error completo:', error.response?.data || error.message);
        
        // Relanzar el error con un mensaje más claro
        if (error.response?.data) {
            const errorMessage = typeof error.response.data === 'object' 
                ? JSON.stringify(error.response.data) 
                : error.response.data;
            throw new Error(`Error al crear factura: ${errorMessage}`);
        }
        throw error;
    }
};

// Actualizar una factura
export const updateFactura = async (id, facturaData) => {
    try {
        const response = await api.put(`${API_URL}${id}/`, facturaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        throw error;
    }
};

// Marcar factura como pagada
export const marcarFacturaPagada = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/pagar/`);
        return response.data;
    } catch (error) {
        console.error('Error al marcar factura como pagada:', error);
        throw error;
    }
};

// Anular una factura
export const anularFactura = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/anular/`);
        return response.data;
    } catch (error) {
        console.error('Error al anular factura:', error);
        throw error;
    }
};

// Recalcular totales de una factura
export const recalcularFactura = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/recalcular/`);
        return response.data;
    } catch (error) {
        console.error('Error al recalcular factura:', error);
        throw error;
    }
};

// Eliminar una factura
export const deleteFactura = async (id) => {
    try {
        const response = await api.delete(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        throw error;
    }
};

// Limpiar todas las facturas de prueba
export const limpiarComprobantes = async () => {
    try {
        const response = await api.delete(`${API_URL}limpiar_datos/`);
        return response.data;
    } catch (error) {
        console.error('Error al limpiar comprobantes:', error);
        throw error;
    }
};

export default {
    getFacturas,
    getFacturaById,
    createFactura,
    createFacturaFromCarrito,
    updateFactura,
    marcarFacturaPagada,
    anularFactura,
    recalcularFactura,
    deleteFactura,
    limpiarComprobantes
};
