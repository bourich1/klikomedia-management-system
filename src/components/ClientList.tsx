import React from 'react'
import { type Client } from '../lib/supabase'
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react'

interface ClientListProps {
  clients: Client[]
  onEditClient: (client: Client) => void
  onDeleteClient: (clientId: string) => void
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEditClient, onDeleteClient }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA')
  }

  const getPaymentStatus = (client: Client) => {
    const percentage = (client.paid_amount / client.monthly_amount) * 100
    if (percentage >= 100) return { status: 'مدفوع بالكامل', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (percentage >= 50) return { status: 'مدفوع جزئياً', color: 'text-amber-600', bgColor: 'bg-amber-100' }
    return { status: 'غير مدفوع', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد عملاء بعد</h3>
        <p className="text-gray-600">ابدأ بإضافة عميل جديد لإدارة المدفوعات</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">قائمة العملاء</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {clients.map((client) => {
          const paymentStatus = getPaymentStatus(client)
          return (
            <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{client.full_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color} ${paymentStatus.bgColor}`}>
                      {paymentStatus.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">المبلغ الإجمالي</p>
                      <p className="text-lg font-semibold text-gray-900">{client.monthly_amount.toFixed(2)} د.م</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                      <p className="text-lg font-semibold text-green-600">{client.paid_amount.toFixed(2)} د.م</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                      <p className="text-lg font-semibold text-red-600">{client.remaining_amount.toFixed(2)} د.م</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      <span>بداية الخدمة: {formatDate(client.service_start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      <span>الدفعة التالية: {formatDate(client.next_payment_due)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((client.paid_amount / client.monthly_amount) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {((client.paid_amount / client.monthly_amount) * 100).toFixed(1)}% مدفوع
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse mr-6">
                  <button
                    onClick={() => onEditClient(client)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClientList