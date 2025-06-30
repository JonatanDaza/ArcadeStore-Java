"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

const authHeaders = (token) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

const processCheckout = async (checkoutData, token) => {
    try {
        const response = await axios.post(`${API_URL}/api/sales/checkout`, checkoutData, authHeaders(token));
        return response.data;
    } catch (error) {
        // Loguear el error para debugging en el navegador del cliente
        console.error('Error al procesar el checkout:', error.response || error);

        // Lanzar un error más específico para que el componente lo pueda manejar.
        // Si el backend envía un mensaje de error (ej. "Juego no encontrado"), lo usamos.
        throw new Error(error.response?.data?.message || 'Ocurrió un error al procesar tu pago. Por favor, intenta de nuevo.');
    }
};

const CheckoutService = { processCheckout };

export default CheckoutService;