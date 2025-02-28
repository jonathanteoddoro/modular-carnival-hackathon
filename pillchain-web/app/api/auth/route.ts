import { NextRequest } from "next/server";
import * as jose from 'jose'
import { DynamicResponse } from "@/utils/DynamicResponse";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    let body = null;
    try {
        body = await req.json() as any;
    } catch (e) {
        return new DynamicResponse('Bad Request', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    if (!body) {
        return new DynamicResponse('Bad Request', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
    const { email, password } = body;
    if (!email || !password) {
        return new DynamicResponse('Bad Request', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const user = await prisma.client.findUnique({
        where: {
            email
        }
    });


    if (!user || !bcrypt.compareSync(password, user.password)) {
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
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, JWT_SECRET, {
        expiresIn: '30d'
    })

    return new DynamicResponse({
        token,
    }, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    })

}