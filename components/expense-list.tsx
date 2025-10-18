'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Image as ImageIcon, X } from 'lucide-react'

const CATEGORIES = [
  'All',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
]

interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description?: string
  receiptPath?: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)

  const filteredExpenses =
    selectedCategory === 'All'
      ? expenses
      : expenses.filter((exp) => exp.category === selectedCategory)

  // Calculate monthly totals
  const calculateMonthlyTotals = () => {
    const monthlyData: { [key: string]: number } = {}

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
  }

  const monthlyTotals = calculateMonthlyTotals()
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return
    }

    setDeleting(id)
    try {
      await onDelete(id)
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Current Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${monthlyTotals[0]?.[1]?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyTotals[0] ? formatMonth(monthlyTotals[0][0]) : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average/Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${monthlyTotals.length > 0
                ? (monthlyTotals.reduce((sum, [, amount]) => sum + amount, 0) / monthlyTotals.length).toFixed(2)
                : '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last {monthlyTotals.length} month{monthlyTotals.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Expense History</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No expenses found</p>
              <p className="text-sm mt-2">
                {selectedCategory !== 'All'
                  ? 'Try selecting a different category'
                  : 'Add your first expense to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {/* Receipt Thumbnail */}
                    {expense.receiptPath && (
                      <div
                        className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => setSelectedReceipt(expense.receiptPath!)}
                      >
                        <img
                          src={expense.receiptPath}
                          alt="Receipt"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm font-medium text-gray-700">
                          {expense.category}
                        </span>
                        {expense.receiptPath && (
                          <>
                            <span className="text-sm text-gray-600">•</span>
                            <ImageIcon className="h-4 w-4 text-blue-600" />
                          </>
                        )}
                      </div>
                      {expense.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {expense.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleting === expense.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Totals */}
      {monthlyTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTotals.map(([month, amount]) => (
                <div
                  key={month}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {formatMonth(month)}
                  </span>
                  <span className="text-lg font-semibold">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
              onClick={() => setSelectedReceipt(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={selectedReceipt}
              alt="Receipt"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
