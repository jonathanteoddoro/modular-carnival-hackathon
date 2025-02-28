import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const frauds = await prisma.detectedFraudes.findMany({
    });
    
    return NextResponse.json(frauds);
  } catch (error) {
    console.error('Failed to fetch frauds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fraud data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract the required fields
    const { pharmacyWallet, medicineName } = body;
    
    // Validate required fields
    if (!pharmacyWallet || !medicineName) {
      return NextResponse.json(
        { error: 'Missing required fields: pharmacyWallet and medicineName are required' },
        { status: 400 }
      );
    }
    
    // Create a new fraud record
    const newFraud = await prisma.detectedFraudes.create({
      data: {
        pharmacyWallet,
        medicineName,
        detectedAt: new Date(), // Current timestamp
      }
    });
    
    // Return success response with the created record
    return NextResponse.json(newFraud, { status: 201 });
  } catch (error) {
    console.error('Failed to create fraud record:', error);
    return NextResponse.json(
      { error: 'Failed to create fraud record' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
