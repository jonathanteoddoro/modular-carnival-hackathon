// app/api/sales/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar os dados recebidos
    if (!data.pharmacyWallet || !data.customerWallet || !data.medicineId || !data.transactionHash) {
      return NextResponse.json(
        { error: 'Dados incompletos para registro da venda' },
        { status: 400 }
      )
    }

    // Criar registro no banco de dados
    const sale = await prisma.salesHistory.create({
      data: {
        pharmacyWallet: data.pharmacyWallet,
        medicineName: data.medicineName || 'Desconhecido',
        customerWallet: data.customerWallet,
        medicineId: data.medicineId,
        transactionHash: data.transactionHash,
        transactionDate: new Date()
      },
    })

    return NextResponse.json(
      { message: 'Venda registrada com sucesso', sale },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar a requisição' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Manter o método POST existente...

export async function GET() {
  try {
    const sales = await prisma.salesHistory.findMany({
      orderBy: {
        transactionDate: 'desc'
      }
    })

    return NextResponse.json({ sales })
  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de vendas' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}