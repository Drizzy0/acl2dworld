import { PaystackButton } from "react-paystack";

/**
 * A reusable Paystack payment button for Next.js apps.
 *
 * @param {Object} props
 * @param {string} props.email - Customer email
 * @param {number} props.amount - Amount in kobo (₦1 = 100 kobo)
 * @param {string} props.name - Customer name
 * @param {string} props.reference - Optional unique transaction reference
 * @param {function} props.onSuccess - Called when payment is successful
 * @param {function} props.onClose - Called when payment modal is closed
 */
export const PaystackPaymentButton = ({
  email,
  amount,
  name,
  reference,
  onSuccess,
  onClose,
}) => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const componentProps = {
    email,
    amount,
    metadata: { name },
    publicKey,
    text: "Pay Now",
    reference: reference || `ref-${Date.now()}`,
    onSuccess: (response) => {
      console.log("✅ Payment successful:", response);
      if (onSuccess) onSuccess(response);
    },
    onClose: () => {
      console.log("❌ Payment window closed");
      if (onClose) onClose();
    },
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
    />
  );
};