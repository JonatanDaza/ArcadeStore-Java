import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8085/api/payments';

class PaymentService {
  // Verificar conexión con el servidor
  static async checkConnection(token) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // Obtener todos los pagos
  static async getAllPayments(token) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: No tienes permisos para acceder a los pagos');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Obtener pago por ID
  static async getPaymentById(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Crear nuevo pago
  static async createPayment(paymentData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
}

export default PaymentService;