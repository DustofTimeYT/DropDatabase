import React, { useCallback } from "react"
import { useKeycloak } from "@react-keycloak/web"

export const LoginPage: React.FC = () => {
  const { keycloak } = useKeycloak()

  const handleLogin = useCallback(() => {
    keycloak?.login()
  }, [keycloak])

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Photo */}
      <div className="w-full md:w-1/2 h-64 md:h-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-xl max-w-md">
              Connect with a world of beautiful moments and memories
            </p>
          </div>
        </div>
        <div className="bg-gray-200 border-2 border-dashed w-full h-full" />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 text-white font-bold text-2xl p-3 rounded-xl w-16 h-16 flex items-center justify-center">
              P
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-500">
              Securely access your photos and albums
            </p>
          </div>

          {/* External IDP Button */}
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              onClick={handleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Sign in with Single Sign-On
            </button>
          </div>

          <div className="px-8 py-6 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
