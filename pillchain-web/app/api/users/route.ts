import { DynamicResponse } from "@/utils/DynamicResponse";
import { NextRequest } from "next/server";
import { CreateUser } from "./zod-validation/CreateUser";
import { privateKeyToAccount } from "viem/accounts";
import { scrollSepolia } from "viem/chains";
import { createSmartAccountClient } from "@biconomy/account";


import bcrypt from "bcrypt";

import { PrismaClient } from '@prisma/client';
import {
    Hex,
    createWalletClient,
    encodeFunctionData,
    http,
    parseAbi,
    zeroAddress,
} from "viem";

const bundlerUrl = "https://bundler.biconomy.io/api/v2/534351/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const paymasterUrl = "https://paymaster.biconomy.io/api/v2/534351/FTsMKnmPA.8c4da003-3487-47b8-9a3f-0c6c72b456da";
const privateKey = "cc9724f3de41a992ef9707caa6f17e8b4fa0e8796e00742d1fcd91c43589c26f";
const account = privateKeyToAccount(`0x${privateKey}`)



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

    try {
        const client = createWalletClient({
            account,
            chain: scrollSepolia,
            transport: http(),
        });

        const eoa = client.account.address;


        console.log("EOA Address: ", eoa);

        const smartAccount = await createSmartAccountClient({
            signer: client,
            bundlerUrl,
            paymasterUrl,
        });

        const saAddress = await smartAccount.getAccountAddress();
        console.log("Smart Account Address: ", saAddress);

        try {
            const balance = await client.getAddresses();
            console.log("Smart Account Balance: ", balance);

            const nftAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
            const parsedAbi = parseAbi(["function safeMint(address _to)"]);
            const nftData = encodeFunctionData({
                abi: parsedAbi,
                functionName: "safeMint",
                args: [saAddress as Hex],
            });

            const userOpResponse = await smartAccount.sendTransaction({
                to: nftAddress,
                data: nftData,
                value: "0",
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("transactionHash", transactionHash);
            const userOpReceipt = await userOpResponse.wait();
            if (userOpReceipt.success == "true") {
                console.log("UserOp receipt", userOpReceipt);
                console.log("Transaction receipt", userOpReceipt.receipt);
            }
        } catch (e) {
            console.error(e);
            return new DynamicResponse('Internal Server Error', {
                status: 500,
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
        }
    } catch (e) {
        console.error(e);
        return new DynamicResponse('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }
}

export async function GET(req: NextRequest) {
    return new DynamicResponse('Hello, World!', {
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}