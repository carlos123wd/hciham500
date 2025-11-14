import React from "react";
import { supabase } from "./supabaseClient";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // يرجعك للتطبيق بعد تسجيل الدخول
        },
      });
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
