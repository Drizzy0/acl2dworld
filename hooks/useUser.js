"use client";
import { useState, useEffect, useCallback } from "react";
import {
  account,
  databases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Query } from "appwrite";

export function useUser() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      let currentUser;

      try {
        currentUser = await account.get();
        setUser(currentUser);
        console.log("✅ Active session found for:", currentUser.email);
      } catch (error) {
        if (error.code === 401) {
          console.log("ℹ️ No active session found");
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        } else {
          console.error("❌ Error fetching user:", error.message);
          throw error;
        }
      }

      if (!currentUser.emailVerification) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const res = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", currentUser.$id)]
      );

      if (res.documents.length > 0) {
        setProfile(res.documents[0]);
      } else {
        console.warn("⚠️ No user document found for:", currentUser.$id);
        setProfile(null);
      }
    } catch (err) {
      if (err.code === 401) {
        console.log("ℹ️ No active session found");
      } else {
        console.error("❌ useUser error:", err.message);
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (data) => {
    if (!profile) return null;
    try {
      const updated = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        profile.$id,
        data
      );
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error("❌ Error updating profile:", err.message);
      throw err;
    }
  };

  return { user, profile, loading, refetch: fetchUser, updateProfile };
}