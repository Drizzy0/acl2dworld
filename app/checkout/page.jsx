"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    promoCode: "",
  });
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (formData.promoCode === "WELCOME10") {
      setAppliedPromo(true);
      setPromoDiscount(totalPrice * 0.1);
      toast.success("Promo code applied! 10% off.");
    } else {
      toast.error("Invalid promo code.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Checkout data:", {
      ...formData,
      cartItems,
      total: totalPrice - promoDiscount,
    });
    toast.success("Redirecting to payment...");
    setIsSubmitting(false);
  };

  const subtotal = totalPrice;
  const finalTotal = subtotal - promoDiscount;

  if (cartItems.length === 0) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-4 z-10">
        <div className="flex items-start justify-between mb-8">
          <Link
            href="/cart"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold dark:text-white">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <User size={20} className="mr-2" />
                Shipping Address
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 dark:text-white">
                Promo Code
              </h3>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Enter promo code"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <p className="text-green-600 mt-2 font-semibold">
                  Discount applied: ₦{promoDiscount.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <MapPin size={20} className="mr-2" />
                Order Summary
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="font-semibold dark:text-white">
                      ₦{Number(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-gray-200 dark:border-gray-600" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₦{promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We'll integrate secure Paystack payment here.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting
                  ? "Processing..."
                  : `Pay ₦${finalTotal.toLocaleString()}`}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-sm">
              <h3 className="font-bold mb-2 dark:text-white">Need Help?</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Phone size={16} className="mr-2" /> +234 123 456 7890
                </p>
                <p className="flex items-center">
                  <Mail size={16} className="mr-2" /> support@airclothing.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;