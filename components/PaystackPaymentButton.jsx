"use client";
import { PaystackButton } from "react-paystack";

const PaystackPaymentButton = ({
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
      onSuccess?.(response);
    },
    onClose: () => {
      console.log("❌ Payment window closed");
      onClose?.();
    },
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold shadow transition"
    />
  );
};

export default PaystackPaymentButton;