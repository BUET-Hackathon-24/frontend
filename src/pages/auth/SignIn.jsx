import { getRawAuthToken } from '@/lib/API'
import { useState } from 'react'

const AuthForm = () => {
  const authToken = getRawAuthToken()
  if (authToken) {
    return <Navigate to="/user/chat" />
  }

  const [isSignUp, setIsSignUp] = useState(false)

  const SignInForm = () => (
    <div className="w-full p-8">
      <h1 className="text-5xl font-bold text-indigo-600">Welcome back!</h1>
      <form className="mt-12">
        <div className="space-y-6">
          <div className="relative">
            <input
              id="signin-email"
              name="email"
              type="text"
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="john@doe.com"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Email address
            </label>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type="password"
              name="password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Password
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-12 w-full px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer"
        >
          Sign in
        </button>
      </form>
      <a
        href="#"
        className="mt-4 block text-sm text-center font-medium text-indigo-600 hover:underline"
      >
        Forgot your password?
      </a>
    </div>
  )

  const SignUpForm = () => (
    <div className="w-full p-8">
      <h1 className="text-5xl font-bold text-indigo-600">Create account</h1>
      <form className="mt-12">
        <div className="space-y-6">
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Name
            </label>
          </div>
          <div className="relative">
            <input
              id="signup-email"
              name="email"
              type="text"
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="john@doe.com"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Email address
            </label>
          </div>
          <div className="relative">
            <input
              id="signup-password"
              type="password"
              name="password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Password
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-12 w-full px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer"
        >
          Sign up
        </button>
      </form>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[600px] bg-white rounded-lg shadow-lg overflow-hidden relative">
        <div className="grid grid-cols-2 h-full">
          {/* Forms Container */}
          <div className="relative w-full h-full">
            {/* Sign In Form */}
            <div
              className={`w-full h-full transition-transform duration-700 ease-in-out absolute top-0 ${
                isSignUp ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <SignInForm />
            </div>

            {/* Sign Up Form */}
            <div
              className={`w-full h-full transition-transform duration-700 ease-in-out absolute top-0 ${
                isSignUp ? 'translate-x-full opacity-100' : 'translate-x-0 opacity-0'
              }`}
            >
              <SignUpForm />
            </div>
          </div>

          {/* Overlay Container */}
          <div
            className={`w-full h-full transition-transform duration-700 ease-in-out ${
              isSignUp ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 text-white p-8 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </h1>
                <h5 className="text-xl mb-8">
                  {isSignUp
                    ? 'Sign in with your email & password'
                    : 'Start your journey in one click'}
                </h5>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="py-3 px-6 bg-transparent rounded-full text-center text-white font-bold uppercase ring-2 ring-white hover:bg-white/10 active:scale-110 transition-all"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
