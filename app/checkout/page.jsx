"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import {
  getUserAddresses,
  createOrder,
  createOrderItems,
} from "@/lib/appwrite";
import { PaystackPaymentButton } from "@/components/PaystackPaymentButton";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user: currentUser } = useUser();
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
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          firstName: currentUser?.document?.firstName || "",
          lastName: currentUser?.document?.lastName || "",
          email: currentUser?.document?.email || "",
          phone: currentUser?.document?.phoneNumber || "",
        }));

        try {
          const userAddresses = await getUserAddresses(
            currentUser?.document?.userId
          );
          setAddresses(userAddresses);

          let defaultAddr = userAddresses.find((addr) => addr.isDefault);
          if (!defaultAddr && userAddresses.length > 0) {
            defaultAddr = userAddresses[0];
          }

          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.$id);
            setFormData((prev) => ({
              ...prev,
              address: defaultAddr.street || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              postalCode: defaultAddr.postalCode || "",
            }));
          }
        } catch (error) {
          console.error("Failed to load addresses:", error);
          toast.error("Failed to load addresses. Please enter manually.");
        }
      }
      setIsLoading(false);
    }

    loadUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    const selectedAddr = addresses.find((addr) => addr.$id === e.target.value);
    if (selectedAddr) {
      setSelectedAddressId(selectedAddr.$id);
      setFormData((prev) => ({
        ...prev,
        address: selectedAddr.street || "",
        city: selectedAddr.city || "",
        state: selectedAddr.state || "",
        postalCode: selectedAddr.postalCode || "",
      }));
    }
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

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading checkout details...
          </p>
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
                {addresses.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold dark:text-white mb-2">
                      Select Saved Address
                    </label>
                    <select
                      value={selectedAddressId || ""}
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    >
                      <option value="">Use a new address</option>
                      {addresses.map((addr) => (
                        <option key={addr.$id} value={addr.$id}>
                          {addr.street}, {addr.city}, {addr.state}{" "}
                          {addr.postalCode} {addr.isDefault ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Or edit the fields below as needed.
                    </p>
                  </div>
                )}

                {!addresses.length && currentUser && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    No saved addresses found. Enter details below or{" "}
                    <Link
                      href="/profile"
                      className="text-blue-600 hover:underline"
                    >
                      add in profile
                    </Link>
                    .
                  </p>
                )}
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
                Complete your payment securely via Paystack.
              </p>
              <PaystackPaymentButton
                email={formData.email}
                amount={Math.round(Number(finalTotal) * 100)}
                name={`${formData.firstName} ${formData.lastName}`}
                onSuccess={async (response) => {
                  try {
                    console.log("💳 Payment successful:", response);

                    const order = await createOrder(
                      currentUser.document.userId,
                      formData.email,
                      {
                        total: finalTotal,
                        addressId: selectedAddressId,
                        promoCode: formData.promoCode,
                        discount: promoDiscount,
                        status: "Paid",
                      }
                    );

                    console.log("✅ Order created:", order);

                    await createOrderItems(
                      order.$id,
                      currentUser.document.userId,
                      cartItems
                    );

                    console.log("✅ Order items created");

                    clearCart();
                    toast.success("Order placed successfully!");
                    setTimeout(() => {
                      router.push("/profile?tab=orders");
                    }, 500);
                  } catch (error) {
                    console.error("❌ Order creation failed:", error);
                    toast.error(
                      "Payment received but order failed. Please contact support with reference: " +
                        response.reference
                    );
                  }
                }}
                onClose={() => toast.info("Payment window closed")}
              />
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