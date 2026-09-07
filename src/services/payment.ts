declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface PaymentInitiationParams {
  amount: number; // in INR
  bookingNumber: string;
  vehicleTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onFailure: (error: { message: string }) => void;
}

export const paymentService = {
  getRazorpayKey(): string | null {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (key && key.startsWith('rzp_') && key !== 'rzp_test_your_key_id') {
      return key;
    }
    return null;
  },

  isLiveGatewayConfigured(): boolean {
    return this.getRazorpayKey() !== null;
  },

  /**
   * Launch Razorpay checkout or trigger test simulator callback
   */
  processPayment(params: PaymentInitiationParams): void {
    const razorpayKey = this.getRazorpayKey();

    if (!razorpayKey || typeof window.Razorpay === 'undefined') {
      console.log('Using Rentro Simulated Payment Gateway (Development Mode)');
      return;
    }

    try {
      const options = {
        key: razorpayKey,
        amount: Math.round(params.amount * 100), // in paise
        currency: 'INR',
        name: 'Rentro Mobility',
        description: `Self-Drive Rental: ${params.vehicleTitle} (${params.bookingNumber})`,
        image: '/favicon.svg',
        prefill: {
          name: params.customerName,
          email: params.customerEmail,
          contact: params.customerPhone,
        },
        theme: {
          color: '#059669', // Emerald brand accent
        },
        handler: (response: RazorpayPaymentResult) => {
          params.onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            params.onFailure({ message: 'Payment cancelled by customer.' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        params.onFailure({
          message: response.error?.description || 'Payment failed. Please try again.',
        });
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay SDK invocation error:', err);
      params.onFailure({ message: err?.message || 'Failed to initialize payment gateway.' });
    }
  },
};
