// Razorpay Integration Service
// Note: This would typically be implemented on the backend for security
// For demo purposes, we'll simulate the API calls

interface RazorpayConfig {
  key_id: string;
  key_secret: string;
}

interface CreateQRCodePayload {
  type: 'upi_qr';
  usage: 'single_use' | 'multiple_use';
  fixed_amount: boolean;
  payment_amount: number; // Amount in paise (multiply by 100)
  description: string;
  customer_id?: string;
  close_by?: number; // Unix timestamp
}

interface QRCodeResponse {
  id: string;
  entity: 'qr_code';
  created_at: number;
  type: 'upi_qr';
  usage: 'single_use' | 'multiple_use';
  fixed_amount: boolean;
  payment_amount: number;
  status: 'active' | 'inactive' | 'closed';
  description: string;
  short_url: string;
  customer_id?: string;
  close_by?: number;
  closed_at?: number;
  image_url: string; // This is the QR code image URL
  payments_count_received: number;
  payments_amount_received: number;
}

interface PaymentStatusResponse {
  id: string;
  entity: 'payment';
  amount: number;
  currency: 'INR';
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id?: string;
  description: string;
  method: 'upi';
  vpa?: string; // UPI ID used for payment
  created_at: number;
}

class RazorpayService {
  private config: RazorpayConfig;

  constructor() {
    // In production, these should be environment variables
    this.config = {
      key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_demo',
      key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'demo_secret'
    };
  }

  // Generate UPI QR Code for payment
  async createQRCode(payload: CreateQRCodePayload): Promise<QRCodeResponse> {
    // In production, this API call would be made from your backend
    // For demo purposes, we'll simulate the response

    console.log('Creating QR Code with Razorpay:', payload);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock QR Code response
    const qrCodeResponse: QRCodeResponse = {
      id: `qr_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      entity: 'qr_code',
      created_at: Math.floor(Date.now() / 1000),
      type: 'upi_qr',
      usage: payload.usage,
      fixed_amount: payload.fixed_amount,
      payment_amount: payload.payment_amount,
      status: 'active',
      description: payload.description,
      short_url: `https://rzp.io/i/${Math.random().toString(36).substr(2, 8)}`,
      customer_id: payload.customer_id,
      close_by: payload.close_by,
      // For demo, we'll generate a mock QR code URL
      image_url: this.generateMockQRCode(payload.payment_amount, payload.description),
      payments_count_received: 0,
      payments_amount_received: 0
    };

    return qrCodeResponse;
  }

  // Check payment status for a QR code
  async getQRCodeStatus(qrCodeId: string): Promise<QRCodeResponse> {
    console.log('Checking QR Code status:', qrCodeId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo, simulate payment completion after 10 seconds
    const isPaymentComplete = Math.random() > 0.3; // 70% chance of payment

    const response: QRCodeResponse = {
      id: qrCodeId,
      entity: 'qr_code',
      created_at: Math.floor(Date.now() / 1000) - 30,
      type: 'upi_qr',
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: 125000, // Will be dynamic in real implementation
      status: isPaymentComplete ? 'closed' : 'active',
      description: 'Aureum Market Payment',
      short_url: `https://rzp.io/i/${qrCodeId.substr(-8)}`,
      image_url: this.generateMockQRCode(125000, 'Aureum Market Payment'),
      payments_count_received: isPaymentComplete ? 1 : 0,
      payments_amount_received: isPaymentComplete ? 125000 : 0,
      closed_at: isPaymentComplete ? Math.floor(Date.now() / 1000) : undefined
    };

    return response;
  }

  // Get payments made to a QR code
  async getQRCodePayments(qrCodeId: string): Promise<PaymentStatusResponse[]> {
    console.log('Getting payments for QR Code:', qrCodeId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo, return a mock payment if QR code is "paid"
    const qrStatus = await this.getQRCodeStatus(qrCodeId);

    if (qrStatus.payments_count_received > 0) {
      return [{
        id: `pay_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        entity: 'payment',
        amount: qrStatus.payment_amount,
        currency: 'INR',
        status: 'captured',
        description: qrStatus.description,
        method: 'upi',
        vpa: 'customer@paytm', // Mock UPI ID
        created_at: qrStatus.closed_at || Math.floor(Date.now() / 1000)
      }];
    }

    return [];
  }

  // Generate a mock QR code image URL
  private generateMockQRCode(amount: number, description: string): string {
    // Using QR Server API to generate actual QR codes for demo
    const upiString = `upi://pay?pa=merchant@razorpay&pn=Aureum Market&am=${(amount / 100).toFixed(2)}&cu=INR&tn=${encodeURIComponent(description)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
  }

  // Convert rupees to paise (Razorpay uses paise)
  convertToPaise(rupees: number): number {
    return Math.round(rupees * 100);
  }

  // Convert paise to rupees
  convertToRupees(paise: number): number {
    return paise / 100;
  }

  // Validate webhook signature (for production)
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // In production, implement proper HMAC SHA256 validation
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    // return expectedSignature === signature;

    // For demo, always return true
    return true;
  }
}

export const razorpayService = new RazorpayService();
export type { QRCodeResponse, PaymentStatusResponse, CreateQRCodePayload };