'use client'

import { useState, useEffect } from 'react'
import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'

interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description?: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleExpenseAdded = () => {
    fetchExpenses()
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Keep track of your spending and manage your budget
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Add Expense Form */}
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />

          {/* Expense List and Analytics */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          ) : (
            <ExpenseList expenses={expenses} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </main>
  )
}
