import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ClientList from './ClientList'
import ClientForm from './ClientForm'
import { supabase, type Client } from '../lib/supabase'
import { Plus, Users, TrendingUp, LogOut, Wallet } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { logout , user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingClient(null)
    fetchClients()
  }

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId)

        if (error) throw error
        fetchClients()
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    }
  }

  // Calculate statistics
  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, client) => sum + client.monthly_amount, 0)
  const totalPaid = clients.reduce((sum, client) => sum + client.paid_amount, 0)
  const totalRemaining = clients.reduce((sum, client) => sum + client.remaining_amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم العملاء</h1>
              <p className="text-gray-600">مرحباً بك في نظام إدارة عملاء الوكالة</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleAddClient}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة عميل جديد
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} د.م</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">المبلغ المحصل</p>
                <p className="text-2xl font-bold text-gray-900">{totalPaid.toFixed(2)} د.م</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-amber-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                <p className="text-2xl font-bold text-gray-900">{totalRemaining.toFixed(2)} د.م</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <ClientList
          clients={clients}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
        />

        {/* Client Form Modal */}
        {showForm && (
          <ClientForm
            client={editingClient}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard