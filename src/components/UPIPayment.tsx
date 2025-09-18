import React, { useState, useEffect } from 'react';
import { razorpayService, QRCodeResponse } from '../services/razorpay';

interface UPIPaymentProps {
  amount: number; // Amount in rupees
  description: string;
  orderId: string;
  onPaymentSuccess: (paymentDetails: any) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({
  amount,
  description,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [qrCode, setQrCode] = useState<QRCodeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Generate QR Code on component mount
  useEffect(() => {
    generateQRCode();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onPaymentError('Payment timed out. Please try again.');
    }
  }, [timeLeft, paymentStatus]);

  // Poll for payment status
  useEffect(() => {
    if (qrCode && paymentStatus === 'pending') {
      const interval = setInterval(async () => {
        await checkPaymentStatus();
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [qrCode, paymentStatus]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const qrCodeData = await razorpayService.createQRCode({
        type: 'upi_qr',
        usage: 'single_use',
        fixed_amount: true,
        payment_amount: razorpayService.convertToPaise(amount),
        description: `${description} - Order: ${orderId}`,
        customer_id: `customer_${Date.now()}`,
        close_by: Math.floor(Date.now() / 1000) + 600 // Close after 10 minutes
      });

      setQrCode(qrCodeData);
    } catch (error) {
      console.error('Error generating QR code:', error);
      onPaymentError('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!qrCode || checkingPayment) return;

    setCheckingPayment(true);
    setPaymentStatus('checking');

    try {
      const status = await razorpayService.getQRCodeStatus(qrCode.id);

      if (status.payments_count_received > 0) {
        // Payment successful
        setPaymentStatus('success');

        // Get payment details
        const payments = await razorpayService.getQRCodePayments(qrCode.id);
        if (payments.length > 0) {
          onPaymentSuccess({
            paymentId: payments[0].id,
            amount: payments[0].amount,
            currency: payments[0].currency,
            method: payments[0].method,
            vpa: payments[0].vpa,
            status: payments[0].status,
            qrCodeId: qrCode.id
          });
        }
      } else {
        setPaymentStatus('pending');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('pending');
    } finally {
      setCheckingPayment(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleManualCheck = async () => {
    await checkPaymentStatus();
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>🔄</div>
        <h3>Generating UPI QR Code...</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>Please wait while we prepare your payment</p>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h3 style={{ color: 'green' }}>Payment Successful!</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Your payment of ₹{amount.toFixed(2)} has been received
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3>Pay with UPI</h3>
        <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0' }}>
          Scan the QR code with any UPI app
        </p>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'var(--color-gold)',
          marginBottom: '8px'
        }}>
          ₹{amount.toFixed(2)}
        </div>
        <div style={{
          fontSize: '14px',
          color: paymentStatus === 'checking' ? 'orange' : 'var(--color-text-secondary)'
        }}>
          {paymentStatus === 'checking' ? '🔄 Checking payment...' : `⏱️ ${formatTime(timeLeft)} remaining`}
        </div>
      </div>

      {/* QR Code */}
      {qrCode && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="gold-frame" style={{
            display: 'inline-block',
            padding: '16px',
            background: 'white',
            borderRadius: '12px'
          }}>
            <img
              src={qrCode.image_url}
              alt="UPI QR Code"
              style={{
                width: '250px',
                height: '250px',
                display: 'block'
              }}
            />
          </div>

          {/* QR Code Instructions */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(212,175,55,0.1)',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>How to pay:</div>
            <div style={{ textAlign: 'left' }}>
              1. Open any UPI app (PhonePe, GPay, Paytm, BHIM)<br/>
              2. Tap "Scan QR" or "Pay"<br/>
              3. Scan this QR code<br/>
              4. Enter your UPI PIN to complete payment
            </div>
          </div>
        </div>
      )}

      {/* Popular UPI Apps */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          Supported UPI Apps:
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { name: 'PhonePe', color: '#5f259f' },
            { name: 'GPay', color: '#4285f4' },
            { name: 'Paytm', color: '#00baf2' },
            { name: 'BHIM', color: '#077bd7' }
          ].map(app => (
            <div
              key={app.name}
              style={{
                padding: '8px 12px',
                background: `${app.color}20`,
                border: `1px solid ${app.color}40`,
                borderRadius: '6px',
                fontSize: '12px',
                color: app.color,
                fontWeight: 'bold'
              }}
            >
              {app.name}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={handleManualCheck}
          className="btn-primary"
          disabled={checkingPayment}
          style={{ flex: 1 }}
        >
          {checkingPayment ? 'Checking...' : 'Check Payment Status'}
        </button>
        <button
          onClick={onCancel}
          className="btn-ghost"
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>

      {/* Security Note */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(0,150,0,0.1)',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
        textAlign: 'center'
      }}>
        🔒 Secure payment powered by Razorpay. Your payment details are safe and encrypted.
      </div>
    </div>
  );
};

export default UPIPayment;