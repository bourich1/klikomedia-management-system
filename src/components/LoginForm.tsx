import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await login(email, password)
    
    if (error) {
      setError('بيانات الدخول غير صحيحة')
    }
    
    setLoading(false)
  }

 return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-center mb-8">
              <img
                src="/logo-klikomedia.png"
                alt="Logo"
                className="w-full max-w-xs h-auto mx-auto mb-4 object-contain"
              />
              <h1 className="text-1xl text-gray-900 mb-2">
                Klilomedia Customer Management System
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
  {error && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
      <AlertCircle className="w-5 h-5 ml-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )}

  <div>
    <label
      htmlFor="email"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Email
    </label>
    <div className="relative">
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Enter your email"
        required
        dir="ltr"
      />
      <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  </div>

  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Password
    </label>
    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full text-left pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Enter your password"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {loading ? "Logging in..." : "Login"}
  </button>
</form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm