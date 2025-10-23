"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { account, getUserDocument } from "@/lib/appwrite";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const currentUser = await account.get();
        const userDoc = await getUserDocument(currentUser.$id);

        setUser({
          ...currentUser,
          document: userDoc,
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);