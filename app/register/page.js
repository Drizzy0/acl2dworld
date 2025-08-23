"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(email, password);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center font-bold">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80">
          Register
        </button>
        <p className="mt-4 text-center">
          Have account? <Link href="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}