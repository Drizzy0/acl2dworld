import {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Query,
  Permission,
  Role,
  Avatars,
} from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

if (typeof window !== "undefined") {
  client.setCookieFallback(document.cookie);
}

export const avatars = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
export const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID;
export const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;
export const ORDER_ITEMS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_ITEMS_COLLECTION_ID;
export const ADDRESSES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_COLLECTION_ID;
export const SETTINGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID;
export const PROMOS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROMOS_COLLECTION_ID;
export const ALLFILES_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ALLFILES_BUCKET_ID;

export { ID, Query, Permission, Role };

export async function createUserAccount(firstName, lastName, email, password) {
  try {
    console.log("✅ Creating account for:", email);
    const fullName = `${firstName} ${lastName}`;
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );
    console.log("✅ Account created:", userAccount);

    await account.createEmailPasswordSession(email, password);
    console.log("🔐 User authenticated");

    await account.createVerification(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify`
    );
    console.log("📧 Verification email sent");

    await account.deleteSession("current");
    console.log("👋 Logged out after verification email sent");

    return userAccount;
  } catch (error) {
    console.error("❌ Account creation failed:", error);
    throw error;
  }
}

export async function createUserDocument(userId, firstName, lastName, email) {
  const permissions = [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),

    Permission.read(Role.label("admin")),
    Permission.update(Role.label("admin")),
    Permission.delete(Role.label("admin")),
  ];

  try {
    console.log("📝 Creating user document for userId:", userId);

    const document = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: "",
        role: "User",
        joined: new Date().toISOString(),
        avatarUrl: avatars.getInitials(`${firstName} ${lastName}`).toString(),
      }
    );
    permissions;

    console.log("✅ User document created:", document);
    return document;
  } catch (error) {
    console.error("❌ Document creation failed:", error);
    throw error;
  }
}

export async function getUserDocument(userId) {
  try {
    console.log("🔍 Querying doc for userId:", userId);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      console.log(
        `🔍 Query attempt ${attempts + 1}: found ${
          response.documents.length
        } docs`
      );

      if (response.documents.length > 0) {
        console.log("✅ User document found:", response.documents[0]);
        return response.documents[0];
      }

      if (attempts < maxAttempts - 1) {
        console.log("⏳ Document not found, retrying in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    console.warn(
      "⚠️ No doc found for userId after",
      maxAttempts,
      "attempts:",
      userId
    );
    return null;
  } catch (error) {
    console.error("❌ Error fetching user document:", error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    console.log("🔄 Logging in:", email);
    const session = await account.createEmailPasswordSession(email, password);
    console.log("✅ User logged in:", session);
    return session;
  } catch (error) {
    let message = "Login failed";

    if (error.code === 401) {
      message = "Invalid email or password";
    } else if (error.code === 404) {
      message = "User not found. Please sign up first.";
    } else if (error.code === 409) {
      message = "Please verify your email address first.";
    } else {
      message = error.message || "Something went wrong";
    }

    console.error(`❌ Login failed for ${email}: ${message}`);
    throw new Error(message);
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession("current");
    console.log("✅ User logged out");
  } catch (error) {
    if (error.code === 401) {
      console.log("ℹ️ No active session");
    } else {
      console.error("❌ Logout error:", error);
    }
  }
}

export async function updateUserProfile(docId, data) {
  try {
    console.log("📝 Updating profile for docId:", docId);
    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      docId,
      data
    );
    console.log("✅ Profile updated:", updatedDoc);
    return updatedDoc;
  } catch (error) {
    console.error("❌ Update failed:", error);
    throw error;
  }
}

export async function deleteUserAccount(userId, docId) {
  try {
    console.log("🗑️ Deleting account data for userId:", userId);

    try {
      const addresses = await getUserAddresses(userId);
      for (const addr of addresses) {
        await deleteAddress(addr.$id);
      }
      console.log("✅ Addresses deleted");
    } catch (err) {
      console.warn("⚠️ Could not delete addresses:", err.message);
    }

    try {
      const files = await storage.listFiles(ALLFILES_BUCKET_ID);
      for (const file of files.files) {
        if (file.name.startsWith(`avatar-${userId}`)) {
          await storage.deleteFile(ALLFILES_BUCKET_ID, file.$id);
          console.log("✅ Deleted file:", file.name);
        }
      }
    } catch (fileErr) {
      console.warn("⚠️ Could not delete user files:", fileErr.message);
    }

    await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, docId);
    console.log("✅ User document deleted:", docId);

    try {
      await account.deleteSession("current");
      console.log("✅ Session ended");
    } catch (sessionErr) {
      console.log("ℹ️ No session to end");
    }

    console.log("✅ Account fully deleted");
  } catch (error) {
    console.error("❌ Delete failed:", error);
    throw error;
  }
}

export async function requestPasswordReset(email) {
  try {
    console.log("📧 Sending password reset email to:", email);
    const result = await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    );
    console.log("✅ Password reset email sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Password reset failed:", error);
    throw error;
  }
}

export async function resendVerificationEmail(email) {
  try {
    console.log("📧 Resending verification email for:", email);

    const result = await account.createVerification(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify`
    );
    console.log("✅ Verification email resent:", result);
    return result;
  } catch (error) {
    console.error("❌ Resend verification failed:", error);
    throw error;
  }
}

export async function confirmPasswordReset(userId, secret, newPassword) {
  try {
    console.log("🔒 Confirming password reset for:", userId);
    const result = await account.updateRecovery(userId, secret, newPassword);
    console.log("✅ Password successfully reset:", result);
    return result;
  } catch (error) {
    console.error("❌ Confirm password reset failed:", error);
    throw error;
  }
}

export async function setUserRole(userId, docId, newRole) {
  try {
    await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, docId, {
      role: newRole,
    });

    console.log(`✅ User ${userId} role updated to ${newRole}`);
  } catch (error) {
    console.error("❌ Failed to update user role:", error);
    throw error;
  }
}

export async function checkProfileCompletion(userDoc, userId) {
  if (!userDoc) return { isComplete: false, missingFields: [] };

  const missingFields = [];

  if (!userDoc.firstName || userDoc.firstName.trim() === "") {
    missingFields.push("firstName");
  }
  if (!userDoc.lastName || userDoc.lastName.trim() === "") {
    missingFields.push("lastName");
  }
  if (!userDoc.email || userDoc.email.trim() === "") {
    missingFields.push("email");
  }

  if (
    !userDoc.phoneNumber ||
    userDoc.phoneNumber.trim() === "" ||
    userDoc.phoneNumber.length < 10
  ) {
    missingFields.push("phoneNumber");
  }

  if (!userDoc.avatarUrl) {
    missingFields.push("avatarUrl");
  }

  try {
    const addresses = await getUserAddresses(userId);
    if (addresses.length === 0) {
      missingFields.push("address");
    }
  } catch (error) {
    console.error("Error checking addresses:", error);
    missingFields.push("address");
  }

  const totalFields = 6;
  const completedFields = totalFields - missingFields.length;

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    completionPercentage: Math.round((completedFields / totalFields) * 100),
  };
}

export async function getUserAddresses(userId) {
  try {
    console.log("📍 Fetching addresses for userId:", userId);
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADDRESSES_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
    console.log(`✅ Found ${response.documents.length} addresses`);
    return response.documents;
  } catch (error) {
    console.error("❌ Error fetching addresses:", error);
    throw error;
  }
}

export async function createAddress(userId, addressData) {
  try {
    console.log("📍 Creating address for userId:", userId);

    const document = await databases.createDocument(
      DATABASE_ID,
      ADDRESSES_COLLECTION_ID,
      ID.unique(),
      {
        userId: userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: addressData.isDefault || false,
        type: addressData.type || "shipping",
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    console.log("✅ Address created:", document);
    return document;
  } catch (error) {
    console.error("❌ Address creation failed:", error);
    throw error;
  }
}

export async function updateAddress(addressId, addressData) {
  try {
    console.log("📍 Updating address:", addressId);
    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      ADDRESSES_COLLECTION_ID,
      addressId,
      addressData
    );
    console.log("✅ Address updated:", updatedDoc);
    return updatedDoc;
  } catch (error) {
    console.error("❌ Address update failed:", error);
    throw error;
  }
}

export async function deleteAddress(addressId) {
  try {
    console.log("🗑️ Deleting address:", addressId);
    await databases.deleteDocument(
      DATABASE_ID,
      ADDRESSES_COLLECTION_ID,
      addressId
    );
    console.log("✅ Address deleted");
  } catch (error) {
    console.error("❌ Address deletion failed:", error);
    throw error;
  }
}

export async function setDefaultAddress(userId, addressId) {
  try {
    console.log("📍 Setting default address:", addressId);

    const allAddresses = await getUserAddresses(userId);
    for (const addr of allAddresses) {
      if (addr.isDefault) {
        await updateAddress(addr.$id, { isDefault: false });
      }
    }

    const updated = await updateAddress(addressId, { isDefault: true });
    console.log("✅ Default address set");
    return updated;
  } catch (error) {
    console.error("❌ Failed to set default address:", error);
    throw error;
  }
}

export async function uploadAvatar(userId, file) {
  try {
    console.log("📸 Uploading avatar for userId:", userId);

    try {
      const existingFiles = await storage.listFiles(ALLFILES_BUCKET_ID);
      const userAvatars = existingFiles.files.filter((f) =>
        f.name.startsWith(`avatar-${userId}`)
      );
      for (const avatar of userAvatars) {
        await storage.deleteFile(ALLFILES_BUCKET_ID, avatar.$id);
      }
    } catch (err) {
      console.log("No existing avatar to delete");
    }

    const fileId = ID.unique();
    const uploadedFile = await storage.createFile(
      ALLFILES_BUCKET_ID,
      fileId,
      file,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
    const viewUrl = storage.getFileView(ALLFILES_BUCKET_ID, fileId);
    console.log("🧩 getFileView raw output:", viewUrl);

    let avatarUrl;

    if (typeof viewUrl === "string") {
      avatarUrl = viewUrl;
    } else if (viewUrl instanceof URL) {
      avatarUrl = viewUrl.toString();
    } else if (viewUrl?.href) {
      avatarUrl = viewUrl.href;
    } else {
      console.warn("⚠️ Unexpected viewUrl type:", typeof viewUrl, viewUrl);
      avatarUrl = "";
    }

    console.log("✅ Avatar uploaded URL:", avatarUrl);
    return avatarUrl;
  } catch (error) {
    console.error("❌ Avatar upload failed:", error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    console.log("📦 Fetching all products...");
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    );
    console.log(`✅ Found ${response.documents.length} products`);
    return response.documents;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    console.log("📦 Creating product:", productData.name);

    const document = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        imageUrl: productData.imageUrl || "",
        description: productData.description || "",
      },
      [
        Permission.read(Role.label("admin")),
        Permission.write(Role.label("admin")),
        Permission.update(Role.label("admin")),
        Permission.delete(Role.label("admin")),
      ]
    );

    console.log("✅ Product created:", document);
    return document;
  } catch (error) {
    console.error("❌ Product creation failed:", error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    console.log("📦 Updating product:", productId);

    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        ...productData,
        updatedAt: new Date().toISOString(),
      }
    );

    console.log("✅ Product updated:", updatedDoc);
    return updatedDoc;
  } catch (error) {
    console.error("❌ Product update failed:", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    console.log("🗑️ Deleting product:", productId);

    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );

    console.log("✅ Product deleted");
  } catch (error) {
    console.error("❌ Product deletion failed:", error);
    throw error;
  }
}

export async function uploadProductImage(productId, file) {
  try {
    console.log("📸 Uploading product image for productId:", productId);

    try {
      const existingFiles = await storage.listFiles(ALLFILES_BUCKET_ID);
      const productImages = existingFiles.files.filter((f) =>
        f.name.startsWith(`product-${productId}`)
      );
      for (const img of productImages) {
        await storage.deleteFile(ALLFILES_BUCKET_ID, img.$id);
        console.log("🗑️ Deleted old image:", img.name);
      }
    } catch (err) {
      console.log("ℹ️ No existing image to delete");
    }

    const fileId = ID.unique();
    const uploadedFile = await storage.createFile(
      ALLFILES_BUCKET_ID,
      fileId,
      file,
      [Permission.read(Role.any())]
    );

    const viewUrl = storage.getFileView(ALLFILES_BUCKET_ID, fileId);
    console.log("🧩 getFileView raw output:", viewUrl);

    let imageUrl;
    if (typeof viewUrl === "string") {
      imageUrl = viewUrl;
    } else if (viewUrl instanceof URL) {
      imageUrl = viewUrl.toString();
    } else if (viewUrl?.href) {
      imageUrl = viewUrl.href;
    } else {
      console.warn("⚠️ Unexpected viewUrl type:", typeof viewUrl, viewUrl);
      imageUrl = "";
    }

    console.log("✅ Product image uploaded URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("❌ Product image upload failed:", error);
    throw error;
  }
}