import { DynamicResponse } from "@/utils/DynamicResponse";
import { NextRequest } from "next/server";
import { CreateUser } from "./zod-validation/CreateUser";


import bcrypt from "bcrypt";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()



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

    const validate = CreateUser.safeParse(body);



    if (!validate.success) {
        console.error(validate.error.errors);
        return new DynamicResponse(validate.error.errors, {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const hasUser = await prisma.client.findUnique({
        where: {
            email: body.email
        }
    })

    if (hasUser) {
        return new DynamicResponse('User already exists', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const {id, ...restOfUser} = await prisma.client.create({
        data: {
            email: body.email,
            password: hashedPassword,
            cpf: body.cpf,
            name: body.name,
            wallet: "0xBF10DA0239EdaFdAa57D9D7524cc53a48811E5a5",
        }
    })

    return new DynamicResponse({
        user: restOfUser,
        
    }, {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function GET(req: NextRequest) {
    return new DynamicResponse('Hello, World!', {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}