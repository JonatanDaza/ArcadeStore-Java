"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowBigLeftDash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import CheckoutService from 'app/services/api/checkout';
import ExchangeService from 'app/services/api/exchangeService';

export default function CheckoutPage() {
    const [checkoutData, setCheckoutData] = useState({
        items: [],
        total: 0,
        isExchange: false,
        exchangeId: null,
    });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'credit-card',
        // Fields for credit/debit card
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardName: '',
        // Fields for PSE
        bankCode: '',
        documentType: '',
        documentNumber: '',
        // Fields for PayPal
        paypalEmail: ''
    });
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    // Options for PSE (Colombian banks)
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
        const paymentIntentString = localStorage.getItem('paymentIntent');
        let dataToSet;

        if (paymentIntentString) {
            // --- Flow for an EXCHANGE with a price difference ---
            const paymentDetails = JSON.parse(paymentIntentString);
            // ✅ CORREGIDO: Asegurarse de que es un checkout de intercambio y tiene el ID
            if (paymentDetails.isExchange && paymentDetails.exchangeId) {
                dataToSet = {
                    items: paymentDetails.items,
                    total: paymentDetails.total,
                    isExchange: true,
                    exchangeId: paymentDetails.exchangeId, // ✅ Usar el ID del intercambio
                };
            } else {
                // Si no es un intercambio, se trata como una compra normal (código existente)
            }
        } else {
            // --- Flow for a NORMAL PURCHASE from the shopping cart ---
            const savedCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            const paidItems = savedCart.filter(item => item.price > 0);

            if (paidItems.length === 0) {
                toast.error("There are no paid items in your cart.");
                router.push('/shoppingCart');
                setLoading(false);
                return;
            }

            dataToSet = {
                items: paidItems,
                total: paidItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
                isExchange: false,
                exchangeId: null,
            };
        }

        if (!dataToSet || dataToSet.items.length === 0) {
            toast.error("There is nothing to pay for.");
            router.push(dataToSet && dataToSet.isExchange ? '/library' : '/shoppingCart');
        } else {
            setCheckoutData(dataToSet);
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
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }));
    };

    const handleExpiryChange = (e) => {
        setFormData(prev => ({ ...prev, cardExpiry: formatExpiry(e.target.value) }));
    };

    const renderPaymentFields = () => {
        switch (formData.paymentMethod) {
            case 'credit-card':
            case 'debit-card':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Card Number</label>
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
                            <label className="block text-sm font-medium mb-2">Name on Card</label>
                            <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                placeholder="As it appears on the card"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Expiration Date</label>
                                <input
                                    type="text"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={handleExpiryChange}
                                    required
                                    maxLength="5"
                                    className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none"
                                    placeholder="MM/YY"
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
                            <label className="block text-sm font-medium mb-2">Bank</label>
                            <select name="bankCode" value={formData.bankCode} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none">
                                <option value="">Select your bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Document Type</label>
                            <select name="documentType" value={formData.documentType} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none">
                                <option value="">Select document type</option>
                                {documentTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Document Number</label>
                            <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none" placeholder="Document number"/>
                        </div>
                    </div>
                );

            case 'paypal':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">PayPal Email</label>
                            <input type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none" placeholder="your@paypal.com"/>
                        </div>
                        <div className="bg-[#333] p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0070ba] rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PP</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">You will be redirected to PayPal to complete your payment securely.</p>
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
            case 'credit-card': return 'Credit Card Information';
            case 'debit-card': return 'Debit Card Information';
            case 'pse': return 'PSE Information';
            case 'paypal': return 'PayPal Information';
            default: return 'Payment Information';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        const toastId = toast.loading('Processing transaction...');

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("You must be logged in to complete the transaction.", { id: toastId });
            router.push('/login');
            setProcessing(false);
            return;
        }

        try {
            if (checkoutData.isExchange) {
                // --- LOGIC FOR EXCHANGE PAYMENT ---
                toast.loading('Procesando pago y finalizando intercambio...', { id: toastId });
                // Simulate payment gateway logic here
                await new Promise(resolve => setTimeout(resolve, 1500));

                // ✅ CORREGIDO: Una vez que el pago es exitoso, COMPLETAR el intercambio existente.
                // No se crea uno nuevo.
                await ExchangeService.completeExchange(checkoutData.exchangeId, token);
                
                toast.success('¡Intercambio completado con éxito!', { id: toastId });
                
                localStorage.removeItem('paymentIntent');
                // Redirigir al recibo para una mejor experiencia de usuario
                router.push(`/exchange/receipt/${checkoutData.exchangeId}`);

            } else {
                // --- LOGIC FOR NORMAL PURCHASE ---
                const paymentMethodMap = {
                    'credit-card': 'Credit Card',
                    'debit-card': 'Debit Card',
                    'pse': 'PSE',
                    'paypal': 'PayPal'
                };
    
                const checkoutPayload = {
                    gameIds: checkoutData.items.map(game => game.id),
                    paymentMethod: paymentMethodMap[formData.paymentMethod] || 'Unknown',
                };
    
                const response = await CheckoutService.processCheckout(checkoutPayload, token);

                toast.success('Purchase successful!', { id: toastId });
    
                const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
                const remainingItems = cart.filter(item => item.price === 0);
                localStorage.setItem('shoppingCart', JSON.stringify(remainingItems));
    
                // Redirigir a la página de confirmación de compra normal
                router.push(`/shoppingCart/checkout/confirm?orderId=${response.orderId}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error processing transaction.';
            toast.error(errorMessage, { id: toastId });
            console.error('Processing error:', error);
        } finally {
            setProcessing(false);
        }
    };
    
    
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-xl">Loading checkout...</div>
                </section>
                <Footer />
            </div>
        );
    }

    if (!checkoutData || checkoutData.items.length === 0) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">No items to process</h1>
                        <button onClick={() => router.push('/store')} className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors">
                            Back to store
                        </button>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-[#3a6aff]">
                            {checkoutData.isExchange ? 'Pay Surplus' : 'Checkout'}
                        </h1>
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors text-sm font-bold bg-[#222] p-3 rounded-lg flex items-center justify-center shadow-lg gap-2">
                            <ArrowBigLeftDash size={20}/> Back
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Billing Form */}
                        <div className="bg-[#222] p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">Billing Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none" placeholder="your@email.com"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none" placeholder="First Name"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none" placeholder="Last Name"/>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded-lg focus:border-[#3a6aff] focus:outline-none">
                                        <option value="credit-card">Credit Card</option>
                                        <option value="debit-card">Debit Card</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="pse">PSE</option>
                                    </select>
                                </div>

                                {/* Dynamic Payment Fields */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-[#3a6aff]">
                                        {getPaymentMethodTitle()}
                                    </h3>
                                    {renderPaymentFields()}
                                </div>

                                <button type="submit" disabled={processing} className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${processing ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#3a6aff] hover:bg-[#2952ff]'}`}>
                                    {processing ? 'Processing...' : `Pay $${checkoutData.total.toLocaleString("es-CO")}`}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[#222] p-8 rounded-2xl shadow-lg h-fit">
                            <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">
                                {checkoutData.isExchange ? 'Exchange Summary' : 'Order Summary'}
                            </h2>
                            <div className="space-y-4 mb-6">
                                {checkoutData.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-[#333] rounded-lg">
                                        <img
                                            src={item.image || '/images/default-game.png'}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            onError={(e) => { e.target.src = '/images/default-game.png'; }}
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-bold">{item.title}</h3>
                                            <p className="text-sm text-gray-300">Quantity: {item.quantity || 1}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#3a6aff]">
                                                {item.price === 0 ? 'Free' : `$${(item.price * (item.quantity || 1)).toLocaleString("es-CO")}`}
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
            <Footer />
        </div>
    );
}