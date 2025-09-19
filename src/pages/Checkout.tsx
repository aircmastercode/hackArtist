import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UPIPayment from '../components/UPIPayment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/database';
import { Address } from '../types/database';

interface CheckoutFormData {
  email: string;
  shippingAddress: Address;
  billingAddress: Address;
  useSameAddress: boolean;
  paymentMethod: 'card' | 'upi' | 'wallet';
  specialInstructions: string;
}

const Checkout: React.FC = () => {
  const { items, subtotalUsd, clear } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: currentUser?.email || '',
    shippingAddress: {
      name: userProfile?.name || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    },
    billingAddress: {
      name: userProfile?.name || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    },
    useSameAddress: true,
    paymentMethod: 'upi',
    specialInstructions: ''
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/explore');
    }
  }, [items, navigate]);

  // Calculate totals
  const shippingCost = subtotalUsd > 100 ? 0 : 15; // Free shipping over $100
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotalUsd * taxRate;
  const totalAmount = subtotalUsd + shippingCost + taxAmount;

  const handleInputChange = (
    section: 'shippingAddress' | 'billingAddress' | 'root',
    field: string,
    value: string | boolean
  ) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useSameAddress: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }));
  };

  const validateForm = (): boolean => {
    const { shippingAddress, billingAddress, email } = formData;

    if (!email || !shippingAddress.name || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.postalCode) {
      setError('Please fill in all required shipping fields');
      return false;
    }

    if (!formData.useSameAddress) {
      if (!billingAddress.name || !billingAddress.addressLine1 ||
          !billingAddress.city || !billingAddress.state || !billingAddress.postalCode) {
        setError('Please fill in all required billing fields');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setError('Please log in to complete your order');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Group items by artist for order segments
      const artistGroups = items.reduce((groups, item) => {
        const artistId = item.artwork.artistId;
        if (!groups[artistId]) {
          groups[artistId] = [];
        }
        groups[artistId].push({
          productId: item.artwork.id,
          productTitle: item.artwork.title,
          productImage: item.artwork.imageUrl,
          artistId: item.artwork.artistId,
          artistName: item.artwork.artistName,
          quantity: item.quantity,
          unitPrice: item.artwork.priceUsd,
          totalPrice: item.quantity * item.artwork.priceUsd
        });
        return groups;
      }, {} as Record<string, any[]>);

      const artisanOrders = Object.entries(artistGroups).map(([artistId, orderItems]) => ({
        artistId,
        artistName: orderItems[0].artistName,
        items: orderItems,
        subtotal: orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
        status: 'pending' as const,
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }));

      const orderData = {
        buyerId: currentUser.uid,
        buyerName: userProfile?.name || currentUser.displayName || 'Unknown',
        buyerEmail: currentUser.email!,
        items: items.map(item => ({
          productId: item.artwork.id,
          productTitle: item.artwork.title,
          productImage: item.artwork.imageUrl,
          artistId: item.artwork.artistId,
          artistName: item.artwork.artistName,
          quantity: item.quantity,
          unitPrice: item.artwork.priceUsd,
          totalPrice: item.quantity * item.artwork.priceUsd
        })),
        subtotal: subtotalUsd,
        tax: taxAmount,
        shipping: shippingCost,
        total: totalAmount,
        currency: 'USD',
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: formData.paymentMethod,
        notes: formData.specialInstructions,
        artisanOrders
      };

      // Create order
      const newOrderId = await orderService.create(orderData);
      setOrderId(newOrderId);

      // If UPI payment selected, show payment screen
      if (formData.paymentMethod === 'upi') {
        setCurrentStep('payment');
      } else {
        // For other payment methods, simulate payment
        await new Promise(resolve => setTimeout(resolve, 2000));

        await orderService.update(newOrderId, {
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentId: `payment_${Date.now()}`
        });

        clear();
        navigate(`/order-confirmation/${newOrderId}`);
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    if (!orderId) return;

    try {
      // Update order with payment details
      await orderService.update(orderId, {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: paymentDetails.paymentId
      });

      // Clear cart
      clear();

      // Navigate to success page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Payment successful but failed to update order. Please contact support.');
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setCurrentStep('form');
  };

  const handlePaymentCancel = () => {
    setCurrentStep('form');
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  // Show UPI payment screen
  if (currentStep === 'payment' && formData.paymentMethod === 'upi' && orderId) {
    return (
      <Layout>
        <section className="page-transition" style={{ padding: '24px 16px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Complete Payment</h1>
            <UPIPayment
              amount={totalAmount}
              description="Aureum Market Order"
              orderId={orderId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-transition" style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    background: 'rgba(255,0,0,0.1)',
                    border: '1px solid red',
                    color: 'red',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    {error}
                  </div>
                )}

                {/* Contact Information */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h2 style={{ marginBottom: '16px' }}>Contact Information</h2>
                  <label>
                    Email Address *
                    <input
                      className="input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('root', 'email', e.target.value)}
                      required
                    />
                  </label>
                </div>

                {/* Shipping Address */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h2 style={{ marginBottom: '16px' }}>Shipping Address</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <label>
                      Full Name *
                      <input
                        className="input"
                        value={formData.shippingAddress.name}
                        onChange={(e) => handleInputChange('shippingAddress', 'name', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Phone Number *
                      <input
                        className="input"
                        type="tel"
                        value={formData.shippingAddress.phone}
                        onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <label style={{ marginBottom: '16px' }}>
                    Address Line 1 *
                    <input
                      className="input"
                      value={formData.shippingAddress.addressLine1}
                      onChange={(e) => handleInputChange('shippingAddress', 'addressLine1', e.target.value)}
                      required
                    />
                  </label>
                  <label style={{ marginBottom: '16px' }}>
                    Address Line 2 (Optional)
                    <input
                      className="input"
                      value={formData.shippingAddress.addressLine2}
                      onChange={(e) => handleInputChange('shippingAddress', 'addressLine2', e.target.value)}
                    />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <label>
                      City *
                      <input
                        className="input"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      State *
                      <input
                        className="input"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Postal Code *
                      <input
                        className="input"
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h2 style={{ marginBottom: '16px' }}>Billing Address</h2>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <input
                      type="checkbox"
                      checked={formData.useSameAddress}
                      onChange={(e) => handleSameAddressChange(e.target.checked)}
                    />
                    Same as shipping address
                  </label>

                  {!formData.useSameAddress && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <label>
                          Full Name *
                          <input
                            className="input"
                            value={formData.billingAddress.name}
                            onChange={(e) => handleInputChange('billingAddress', 'name', e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Phone Number
                          <input
                            className="input"
                            type="tel"
                            value={formData.billingAddress.phone}
                            onChange={(e) => handleInputChange('billingAddress', 'phone', e.target.value)}
                          />
                        </label>
                      </div>
                      <label style={{ marginBottom: '16px' }}>
                        Address Line 1 *
                        <input
                          className="input"
                          value={formData.billingAddress.addressLine1}
                          onChange={(e) => handleInputChange('billingAddress', 'addressLine1', e.target.value)}
                          required
                        />
                      </label>
                      <label style={{ marginBottom: '16px' }}>
                        Address Line 2 (Optional)
                        <input
                          className="input"
                          value={formData.billingAddress.addressLine2}
                          onChange={(e) => handleInputChange('billingAddress', 'addressLine2', e.target.value)}
                        />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <label>
                          City *
                          <input
                            className="input"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleInputChange('billingAddress', 'city', e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          State *
                          <input
                            className="input"
                            value={formData.billingAddress.state}
                            onChange={(e) => handleInputChange('billingAddress', 'state', e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Postal Code *
                          <input
                            className="input"
                            value={formData.billingAddress.postalCode}
                            onChange={(e) => handleInputChange('billingAddress', 'postalCode', e.target.value)}
                            required
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Method */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h2 style={{ marginBottom: '16px' }}>Payment Method</h2>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {[
                      { value: 'upi', label: 'UPI', recommended: true, description: 'Instant & Free' },
                      { value: 'card', label: 'Credit/Debit Card', recommended: false, description: 'Processing fee applies' },
                      { value: 'wallet', label: 'Digital Wallet', recommended: false, description: 'Various wallets' }
                    ].map(method => (
                      <label
                        key={method.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px',
                          border: method.recommended ? '2px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          background: formData.paymentMethod === method.value ? 'rgba(212,175,55,0.1)' : 'transparent',
                          cursor: 'pointer',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={(e) => handleInputChange('root', 'paymentMethod', e.target.value)}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{method.label}</span>
                            {method.recommended && (
                              <span style={{
                                background: 'var(--color-gold)',
                                color: 'black',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                              }}>
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {method.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{
                    background: 'rgba(255,165,0,0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <strong>Payment Processing:</strong> Secure payment processing through Razorpay.
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h2 style={{ marginBottom: '16px' }}>Special Instructions</h2>
                  <label>
                    Order Notes (Optional)
                    <textarea
                      className="input"
                      rows={3}
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('root', 'specialInstructions', e.target.value)}
                      placeholder="Any special requests or delivery instructions..."
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', fontSize: '18px', padding: '16px' }}
                >
                  {loading ? 'Processing Order...' :
                   formData.paymentMethod === 'upi' ?
                   `Continue to UPI Payment - ₹${(totalAmount * 83).toFixed(0)}` : // Convert USD to INR for display
                   `Place Order - $${totalAmount.toFixed(2)}`
                  }
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', position: 'sticky', top: '100px' }}>
                <h2 style={{ marginBottom: '16px' }}>Order Summary</h2>

                {/* Items */}
                <div style={{ marginBottom: '16px' }}>
                  {items.map(item => (
                    <div key={`${item.artwork.id}`} style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid rgba(212,175,55,0.2)'
                    }}>
                      <img
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.artwork.title}</div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          by {item.artwork.artistName}
                        </div>
                        <div style={{ fontSize: '12px' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>
                          ${(item.quantity * item.artwork.priceUsd).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.3)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Subtotal:</span>
                    <span>${subtotalUsd.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span>Tax:</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(212,175,55,0.3)'
                  }}>
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost === 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: 'rgba(0,255,0,0.1)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'green',
                    textAlign: 'center'
                  }}>
                    🎉 Free shipping on orders over $100!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;