import React, { useState, useEffect } from 'react'
import { supabase, type Client } from '../lib/supabase'
import { X, Save, User, Calendar, Wallet } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface ClientFormProps {
  client: Client | null
  onClose: () => void
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    full_name: '',
    monthly_amount: '',
    paid_amount: '',
    service_start_date: '',
    next_payment_due: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name,
        monthly_amount: client.monthly_amount.toString(),
        paid_amount: client.paid_amount.toString(),
        service_start_date: client.service_start_date,
        next_payment_due: client.next_payment_due
      })
    }
  }, [client])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const clientData = {
        full_name: formData.full_name.trim(),
        monthly_amount: parseFloat(formData.monthly_amount),
        paid_amount: parseFloat(formData.paid_amount),
        service_start_date: formData.service_start_date,
        next_payment_due: formData.next_payment_due
      }

      if (client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', client.id)

        if (error) throw error
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([{
            ...clientData,
            user_id: user?.id
          }])

        if (error) throw error
      }

      onClose()
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {client ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              اسم العميل الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ادخل اسم العميل"
                required
              />
              <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="monthly_amount" className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ الشهري الإجمالي (د.م)
            </label>
            <div className="relative">
              <input
                type="number"
                id="monthly_amount"
                name="monthly_amount"
                value={formData.monthly_amount}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              <Wallet className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ المدفوع (د.م)
            </label>
            <div className="relative">
              <input
                type="number"
                id="paid_amount"
                name="paid_amount"
                value={formData.paid_amount}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              <Wallet className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="service_start_date" className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ بداية الخدمة
            </label>
            <div className="relative">
              <input
                type="date"
                id="service_start_date"
                name="service_start_date"
                value={formData.service_start_date}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="next_payment_due" className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الدفعة التالية
            </label>
            <div className="relative">
              <input
                type="date"
                id="next_payment_due"
                name="next_payment_due"
                value={formData.next_payment_due}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="flex space-x-3 space-x-reverse pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5 ml-2" />
                  {client ? 'حفظ التعديلات' : 'إضافة العميل'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientForm