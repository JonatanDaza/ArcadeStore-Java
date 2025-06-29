"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowBigLeftDash } from 'lucide-react';

export default function CheckoutPage() {
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'credit-card',
        // Campos para tarjeta de crédito/débito
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardName: '',
        // Campos para PSE
        bankCode: '',
        documentType: '',
        documentNumber: '',
        // Campos para PayPal
        paypalEmail: ''
    });
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    // Opciones para PSE
    const banks = [
        { code: '1007', name: 'Bancolombia' },
        { code: '1001', name: 'Banco de Bogotá' },
        { code: '1019', name: 'Scotiabank Colpatria' },
        { code: '1051', name: 'Davivienda' },
        { code: '1013', name: 'BBVA Colombia' },
        { code: '1009', name: 'Citibank' },
        { code: '1006', name: 'Banco de Occidente' },
        { code: '1012', name: 'Banco Caja Social' },
        { code: '1032', name: 'Banco Falabella' },
        { code: '1023', name: 'Banco de Santander' }
    ];

    const documentTypes = [
        { value: 'CC', label: 'Cédula de Ciudadanía' },
        { value: 'CE', label: 'Cédula de Extranjería' },
        { value: 'NIT', label: 'NIT' }
    ];

    useEffect(() => {
        const savedCheckoutData = localStorage.getItem('checkoutData');
        if (savedCheckoutData) {
            setCheckoutData(JSON.parse(savedCheckoutData));
        } else {
            // Si no hay datos de checkout, redirigir al carrito
            router.push('/shoppingCart');
        }
        setLoading(false);
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = (value) => {
        // Remover espacios y caracteres no numéricos
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        // Agregar espacios cada 4 dígitos
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setFormData(prev => ({ ...prev, cardNumber: formatted }));
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value);
        setFormData(prev => ({ ...prev, cardExpiry: formatted }));
    };

    const renderPaymentFields = () => {
        switch (formData.paymentMethod) {
            case 'credit-card':
            case 'debit-card':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Número de Tarjeta</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                required
                                maxLength="19"
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre en la Tarjeta</label>
                            <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                placeholder="Como aparece en la tarjeta"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Fecha de Vencimiento</label>
                                <input
                                    type="text"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={handleExpiryChange}
                                    required
                                    maxLength="5"
                                    className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                    placeholder="MM/AA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">CVC</label>
                                <input
                                    type="text"
                                    name="cardCVC"
                                    value={formData.cardCVC}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="4"
                                    className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'pse':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Banco</label>
                            <select
                                name="bankCode"
                                value={formData.bankCode}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                            >
                                <option value="">Selecciona tu banco</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                            >
                                <option value="">Selecciona tipo de documento</option>
                                {documentTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Número de Documento</label>
                            <input
                                type="text"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                placeholder="Número de documento"
                            />
                        </div>
                    </div>
                );

            case 'paypal':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email de PayPal</label>
                            <input
                                type="email"
                                name="paypalEmail"
                                value={formData.paypalEmail}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                placeholder="tu@paypal.com"
                            />
                        </div>
                        <div className="bg-[#333] p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0070ba] rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PP</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        Serás redirigido a PayPal para completar tu pago de forma segura.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getPaymentMethodTitle = () => {
        switch (formData.paymentMethod) {
            case 'credit-card':
                return 'Información de Tarjeta de Crédito';
            case 'debit-card':
                return 'Información de Tarjeta Débito';
            case 'pse':
                return 'Información PSE';
            case 'paypal':
                return 'Información PayPal';
            default:
                return 'Información de Pago';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simular procesamiento de pago
        try {
            // Aquí integrarías con tu procesador de pagos (Stripe, PayPal, etc.)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Limpiar el carrito después de un pago exitoso
            localStorage.removeItem('shoppingCart');
            localStorage.removeItem('checkoutData');

            // Redirigir a página de confirmación
            router.push('checkout/confirm');
        } catch (error) {
            // Provide more specific error messages
            const errorMessage = error.response?.data?.message ||
                                 error.message ||
                                 'Error procesando el pago. Inténtalo de nuevo.';
            alert(errorMessage);
            console.error('Payment processing error:', error);
        } finally {
            setProcessing(false);
        }
    };
    if (loading) {
        return (
            <section className="w-full min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                <div className="text-xl">Cargando checkout...</div>
            </section>
        );
    }

    if (!checkoutData) {
        return (
            <section className="w-full min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No hay items para procesar</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors"
                    >
                        Volver a la tienda
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-[#3a6aff]">Checkout</h1>
                    <button
                        onClick={() => router.back()}
                        className="top-6 z-50 text-gray-400 hover:text-blue-800 transition text-3xl font-bold bg-[#222] p-4 rounded-full w-auto h-12 flex items-center justify-center shadow-lg"
                    >
                        <ArrowBigLeftDash/> Volver
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de datos */}
                    <div className="bg-[#222] p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">Información de Facturación</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información básica */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                            placeholder="Nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Apellido</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                            placeholder="Apellido"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Método de pago */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Método de Pago</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                >
                                    <option value="credit-card">Tarjeta de Crédito</option>
                                    <option value="debit-card">Tarjeta Débito</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="pse">PSE</option>
                                </select>
                            </div>

                            {/* Campos dinámicos según método de pago */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#3a6aff]">
                                    {getPaymentMethodTitle()}
                                </h3>
                                {renderPaymentFields()}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                                    processing 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-[#3a6aff] hover:bg-[#2952ff]'
                                }`}
                            >
                                {processing ? 'Procesando...' : 'Procesar Pago'}
                            </button>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="bg-[#222] p-8 rounded-2xl shadow-lg h-fit">
                        <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">Resumen del Pedido</h2>
                        
                        <div className="space-y-4 mb-6">
                            {checkoutData.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-[#333] rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-300">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#3a6aff]">
                                            {item.price === 0 ? 'Gratis' : `$${(item.price * item.quantity).toLocaleString("es-CO")}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-600 mb-4" />
                        
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Total:</span>
                            <span className="text-[#3a6aff]">
                                ${checkoutData.total.toLocaleString("es-CO")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}