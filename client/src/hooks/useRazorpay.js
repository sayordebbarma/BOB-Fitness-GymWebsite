import api from '../utils/api';
import toast from 'react-hot-toast';

const useRazorpay = () => {

  const initiatePayment = async ({ membershipId, onSuccess }) => {
    try {
      // create order on backend
      const { data } = await api.post('/payments/create-order', { membershipId });
      const { order, membership, user } = data;

      // open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Bob Fitness',
        description: `${membership.name} Membership Plan`,
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#E8FF00',
          backdrop_color: '#080808',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          }
        },
        handler: async (response) => {
          // verify payment on backend
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              membershipId,
            });

            if (verifyRes.data.success) {
              toast.success(verifyRes.data.message);
              if (onSuccess) onSuccess();
            }
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initiation failed');
    }
  };

  return { initiatePayment };
};

export default useRazorpay;