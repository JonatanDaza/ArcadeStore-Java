import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

const processCheckout = async (cartData, token) => {
    const response = await axios.post(`${API_URL}/api/sales/checkout`, cartData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
    });
    return response.data;
};

const CheckoutService = { processCheckout };

export default CheckoutService;