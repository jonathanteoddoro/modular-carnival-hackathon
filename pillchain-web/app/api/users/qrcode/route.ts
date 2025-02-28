import { DynamicResponse } from "@/utils/DynamicResponse";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code // 'a', 'b', or 'c'

    const clientQr = await prisma.clientQRCode.findFirst({
        where: {
            qrCode: code,
            validUntil: {
                gte: new Date()
            }
        },
        select: {
            clientId: true
        }
    })

    if (!clientQr) {
        return new DynamicResponse('QR Code not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const client = await prisma.client.findUnique({
        where: {
            id: clientQr.clientId,
        }
    })

    if (!client) {
        return new DynamicResponse('Client not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    return new DynamicResponse({
        wallet: client.wallet
    }, {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// generate a QR code for a client
export async function POST(req: NextRequest) {
    let token = null;

    try {
        token = req.headers.get('Authorization')?.split(' ')[1];
    } catch (e) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    console.log(token);


    if (!token) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error('JWT_SECRET not found');
        return new DynamicResponse('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    let decoded = null;

    try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (e) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }


    const client = await prisma.client.findUnique({
        where: {
            id: decoded.id
        }
    })

    if (!client) {
        return new DynamicResponse('Client not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    // generate a random code 8 digits
    const code = Math.random().toString(36).substring(2, 10);

    const qrCode = await prisma.clientQRCode.upsert({
        create: {
            qrCode: code,
            clientId: decoded.id,
            validUntil: new Date(Date.now() + 3600 * 1000)
        },
        update: {
            qrCode: code,
            validUntil: new Date(Date.now() + 3600 * 1000)
        },
        where: {
            clientId: decoded.id
        }
    })

    return new DynamicResponse({
        code
    }, {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}