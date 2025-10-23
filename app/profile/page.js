"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  MapPin,
  Plus,
  Trash2,
  Check,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import {
  account,
  getUserDocument,
  updateUserProfile,
  logoutUser,
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/appwrite";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ConfirmModal from "@/components/ConfirmModal";
import AvatarUploadModal from "@/components/AvatarUploadModal";
import { uploadAvatar, deleteUserAccount } from "@/lib/appwrite";

const ProfilePage = () => {
  const router = useRouter();
  const { user: contextUser, setUser: setContextUser } = useUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [activeTab, setActiveTab] = useState("info");
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    type: "shipping",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAddressDeleteModal, setShowAddressDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        if (!contextUser) {
          router.push("/sign-in");
          return;
        }

        const authUser = await account.get();
        const userDoc = await getUserDocument(authUser.$id);

        if (userDoc) {
          setUser({
            id: userDoc.$id,
            userId: authUser.$id,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            email: userDoc.email,
            phone: userDoc.phoneNumber || "",
            avatar: userDoc.avatarUrl,
            orders: [],
          });

          setFormData({
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            email: userDoc.email,
            phone: userDoc.phoneNumber || "",
          });

          const userAddresses = await getUserAddresses(authUser.$id);
          setAddresses(userAddresses);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [contextUser, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const updatedDoc = await updateUserProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      });

      console.log("✅ Profile updated:", updatedDoc);

      setUser({
        ...user,
        firstName: updatedDoc.firstName,
        lastName: updatedDoc.lastName,
        phone: updatedDoc.phoneNumber,
      });

      const refreshedDoc = await getUserDocument(user.userId);
      setContextUser({
        ...contextUser,
        document: refreshedDoc,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setContextUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        toast.success("Address updated!");
      } else {
        await createAddress(user.userId, addressForm);
        toast.success("Address added!");
      }

      const updatedAddresses = await getUserAddresses(user.userId);
      setAddresses(updatedAddresses);

      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        type: "shipping",
      });

      const refreshedDoc = await getUserDocument(user.userId);
      setContextUser({
        ...contextUser,
        document: refreshedDoc,
      });
    } catch (error) {
      console.error("Address error:", error);
      toast.error("Address operation failed");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Delete this address?")) return;

    try {
      await deleteAddress(addressId);
      const updatedAddresses = await getUserAddresses(user.userId);
      setAddresses(updatedAddresses);
      toast.success("Address deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(user.userId, addressId);
      const updatedAddresses = await getUserAddresses(user.userId);
      setAddresses(updatedAddresses);
      toast.success("Default address updated!");
    } catch (error) {
      console.error("Default error:", error);
      toast.error("Failed to set default");
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const avatarUrl = await uploadAvatar(user.userId, file);

      console.log("📝 About to update profile with avatarUrl:", avatarUrl);

      if (!avatarUrl) {
        throw new Error("Avatar URL is undefined");
      }

      await updateUserProfile(user.id, { avatarUrl });

      setUser({ ...user, avatar: avatarUrl });

      const refreshedDoc = await getUserDocument(user.userId);
      setContextUser({
        ...contextUser,
        document: refreshedDoc,
      });

      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(user.userId, user.id);
      setContextUser(null);
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    }
  };

  const confirmDeleteAddress = (addressId) => {
    setAddressToDelete(addressId);
    setShowAddressDeleteModal(true);
  };

  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress(addressToDelete);
      const updatedAddresses = await getUserAddresses(user.userId);
      setAddresses(updatedAddresses);
      toast.success("Address deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete address");
    } finally {
      setAddressToDelete(null);
    }
  };

  const tabs = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Order History", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-6 md:mb-8 lg:mb-10 dark:text-white"
        >
          My Profile
        </motion.h1>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover cursor-pointer hover:opacity-80 transition"
                  onClick={() => setShowAvatarModal(true)}
                />
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-4 right-0 bg-black dark:bg-white p-1.5 rounded-full hover:scale-110 transition"
                  title="Change avatar"
                >
                  <Camera size={14} className="text-white dark:text-black" />
                </button>
              </div>
              <h2 className="text-lg md:text-lg lg:text-xl font-bold dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {user.email}
              </p>
              {user.phone && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {user.phone}
                </p>
              )}
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>

          <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {activeTab === "info" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  >
                    <Edit size={20} />
                    <span>{isEditing ? "Cancel" : "Edit"}</span>
                  </button>
                </div>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold dark:text-white mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border ${
                          isEditing
                            ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black"
                            : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold dark:text-white mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border ${
                          isEditing
                            ? "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black"
                            : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-white mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <PhoneInput
                        country={"ng"}
                        value={formData.phone}
                        onChange={(phone) =>
                          setFormData({ ...formData, phone: phone })
                        }
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          fontSize: "16px",
                          paddingLeft: "48px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                        }}
                        buttonStyle={{
                          borderRadius: "8px 0 0 8px",
                          border: "1px solid #d1d5db",
                        }}
                        containerClass="phone-input-container"
                        disabled={!isEditing}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData.phone}
                        disabled
                        className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">
                    My Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    <Plus size={20} />
                    <span>Add Address</span>
                  </button>
                </div>

                {showAddressForm && (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          street: e.target.value,
                        })
                      }
                      className="w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border"
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                        className="w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country: e.target.value,
                          })
                        }
                        className="w-full p-2.5 md:p-3 lg:p-3.5 text-sm md:text-base lg:text-lg text-gray-900 rounded-lg border"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      {editingAddressId ? "Update Address" : "Save Address"}
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                      No addresses saved yet. Add one to complete your profile!
                    </p>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.$id}
                        className="border dark:border-gray-600 p-4 rounded-lg relative"
                      >
                        {addr.isDefault && (
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Check size={12} />
                            <span>Default</span>
                          </span>
                        )}
                        <p className="font-semibold dark:text-white">
                          {addr.street}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {addr.country}
                        </p>
                        <div className="flex space-x-2 mt-4">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.$id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => confirmDeleteAddress(addr.$id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold dark:text-white">
                  Order History
                </h2>
                <div className="text-center py-12">
                  <ShoppingBag
                    size={64}
                    className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No orders yet. Start shopping!
                  </p>
                  <Link href="/shop">
                    <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-semibold">
                      Browse Products
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold dark:text-white">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium dark:text-white">
                      Change Password
                    </span>
                    <Link
                      href="/forgot-password"
                      className="text-black dark:text-white hover:underline"
                    >
                      Manage
                    </Link>
                  </div>

                  {/* Add Delete Account */}
                  <div className="border-t dark:border-gray-600 pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                        Once you delete your account, there is no going back.
                        All your data will be permanently deleted.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This action cannot be undone. All your data including orders, addresses, and profile information will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Keep Account"
        isDangerous={true}
      />

      <ConfirmModal
        isOpen={showAddressDeleteModal}
        onClose={() => {
          setShowAddressDeleteModal(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleConfirmDeleteAddress}
        title="Delete Address?"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />

      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onUpload={handleAvatarUpload}
        currentAvatar={user?.avatar}
      />
    </section>
  );
};

export default ProfilePage;