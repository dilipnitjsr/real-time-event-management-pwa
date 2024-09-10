"use client";

import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import clsx from "clsx";
import { useRouter } from "next/navigation"; // Use this import for Next.js 13.4+
import Image from "next/image";
import image from "@/public/image.png"

const FormWithReCaptcha: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter(); // Initialize the router hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!executeRecaptcha) {
      setError("Recaptcha is not available.");
      setLoading(false);
      return;
    }

    try {
      // Execute recaptcha
      const token = await executeRecaptcha("form_submit");
      console.log("reCaptcha token:", token);

      // Send token to your backend for verification
      const response = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        // Navigate to /settings page on successful verification
        router.push("/settings");
      } else {
        setError(
          `Verification failed: ${
            data.errorCodes?.join(", ") || "Unknown error"
          }`
        );
        setSuccess(false);
      }
    } catch (err) {
      setError(`An error occurred: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg flex justify-center flex-col items-center w-full p-8 bg-sky-400
         border-slate-100 border-[0.3rem] rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Are you a robot? 🤖
      </h2>
      <div className=" w-full flex gap-2 justify-evenly">
        <Button
          type="submit"
          className={clsx(
            " w-16 h-16 text-white border-[0.3rem] border-x-sky-100 rounded-lg transition duration-300",
            { "opacity-50 cursor-not-allowed": loading }
          )}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="14"
                  cy="14"
                  r="13"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              
            </span>
          ) : (
            ""
          )}
        </Button>
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 text-3xl">I'm not a robot</span>
          </div>
        </div>
        <Image className=" w-24 h-16" src={image} alt="pic"/>
      </div>
      {error && <p className="mt-4 text-center text-red-500">❌ {error}</p>}
      {success && (
        <p className="mt-4 text-center text-green-500">
          ✅ Verification successful!
        </p>
      )}
    </form>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={clsx(
      "flex justify-center items-center py-2 px-4 boder-[0.2rem] border-white text-white font-bold rounded-md transition duration-300",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default FormWithReCaptcha;
