"use client";

import { useState } from "react";
import { auth } from "../../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/"); // redirect to home
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); // redirect to home
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        {/* Email / Password */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-xl bg-white/70 border border-gray-200 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-xl bg-white/70 border border-gray-200 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Email/Password Auth Button */}
        <button
          onClick={handleAuth}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="px-3 text-sm text-white/70">or</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Toggle Auth Mode */}
        <p
          className="mt-6 text-center text-sm text-white/80 hover:text-white cursor-pointer transition-all"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </p>
      </div>
    </div>
  );
}
