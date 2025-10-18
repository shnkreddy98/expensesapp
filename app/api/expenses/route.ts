import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { expenseSchema } from '@/lib/validations'
import { z } from 'zod'

// GET - Fetch all expenses with optional category filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const expenses = await prisma.expense.findMany({
      where: category && category !== 'all' ? { category } : {},
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST - Create a new expense
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = expenseSchema.parse(body)

    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        description: data.description,
        receiptPath: data.receiptPath,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an expense
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
