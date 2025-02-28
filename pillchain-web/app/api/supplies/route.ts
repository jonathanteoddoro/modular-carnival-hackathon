import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.medicineName || !data.batchNumber || !data.pharmacyWallet || 
        !data.supplierWallet || !data.quantity || !data.transactionHash) {
      return NextResponse.json(
        { error: 'Dados incompletos para registro do fornecimento' },
        { status: 400 }
      )
    }

    const expirationDate = new Date(data.expirationDate * 1000)

    const supply = await prisma.supplyHistory.create({
      data: {
        medicineName: data.medicineName,
        batchNumber: data.batchNumber,
        expirationDate: expirationDate,
        pharmacyWallet: data.pharmacyWallet,
        supplierWallet: data.supplierWallet,
        quantity: data.quantity,
        transactionHash: data.transactionHash,
        transactionDate: new Date()
      },
    })

    return NextResponse.json(
      { message: 'Fornecimento registrado com sucesso', supply },
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

export async function GET() {
  try {
    const supplies = await prisma.supplyHistory.findMany({
      orderBy: {
        transactionDate: 'desc'
      }
    })

    return NextResponse.json({ supplies })
  } catch (error) {
    console.error('Erro ao buscar histórico de fornecimentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de fornecimentos' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}