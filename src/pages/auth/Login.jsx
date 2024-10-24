import api from '@/lib/axios'
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.post('auth/login', { email, password })
      updateAuthAtStorage(response?.data)
    } catch (error) {
      toast.error(error?.response?.message ?? 'An error occurred')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  const socialButtonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  }

  const handleGoogleSignIn = async () => {
    const response = await api.get('auth/google')
    console.log(response)
    window.open(response?.data.url, '_blank')
    navigate('/user/profile')
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      // variants={containerVariants}
    >
      <motion.div
        className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-xl transition-colors duration-300 bg-white dark:bg-gray-800"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.h2
            className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome back
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Please sign in to continue
          </motion.p>
        </motion.div>

        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 border rounded-lg transition-all duration-300 sm:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 " size={20} />
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 border rounded-lg transition-all duration-300 sm:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                {showPassword ? (
                  <EyeOff
                    // className="absolute right-3 bottom-1/2 transform translate-y-1/2"
                    size={20}
                  />
                ) : (
                  <Eye
                    // className="absolute right-3 bottom-1/2 transform translate-y-1/2"
                    size={20}
                  />
                )}
              </motion.button>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
            </motion.div>
          </div>

          <motion.div className="flex items-center justify-between" variants={itemVariants}>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </motion.a>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.div
                  key="button-content"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sign in
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div className="relative" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t transition-colors duration-300 border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
            <motion.button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              variants={socialButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <IconBrandGoogle />
            </motion.button>
            <motion.button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              variants={socialButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <IconBrandFacebook />
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p
          className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          Not a member?{' '}
          <motion.a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up
          </motion.a>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default LoginPage
