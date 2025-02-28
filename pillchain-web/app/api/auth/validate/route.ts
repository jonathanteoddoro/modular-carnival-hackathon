import { DynamicResponse } from "@/utils/DynamicResponse";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    let headerToken = null;
    try {
        headerToken = req.headers.get('Authorization');
    } catch (e) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    if (!headerToken) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    const token = headerToken.split(' ')[1];
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
    try {
        console.log(token);
        const payload = jwt.verify(token, JWT_SECRET) as any;

        const user = await prisma.client.findUnique({
            where: {
                id: payload.id
            }
        });

        console.log(user);

        if (!user) {
            console.error('User not found');
            return new DynamicResponse('Unauthorized', {
                status: 401,
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
        }
    } catch (e) {
        return new DynamicResponse('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    return new DynamicResponse('OK', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}