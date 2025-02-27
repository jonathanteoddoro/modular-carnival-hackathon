"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import TextField from '@mui/material/TextField';




export default function LoginDrugstore() {

  return (
    <div className="flex flex-row w-full min-h-screen">
        <div className="h-screen w-[40%] bg-red-500 flex flex-col justify-center items-center p-8 gap-8">
            <div className="flex flex-row items-center gap-4 text-5xl text-white font-semibold">
                <Image src="/logo.svg" alt="Pillchain" width={100} height={100} />
                <h1>PillChain</h1>
            </div>
            <h1 className="text-3xl font-bold text-white">Vamos juntos garantir a segurança nas vendas de medicamentos para toda a população brasileira!</h1>
        </div>
        <div className="h-screen w-[60%] flex flex-col justify-center items-center p-8 gap-8">
            <Card className="flex flex-col gap-4 py-8 w-[60%] justify-center items-center">
                <h1 className="text-3xl font-bold">Já é Usuário?</h1>
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <TextField label="CNPJ" id="cnpj" placeholder="CNPJ" />
                </div>
                <a className="self-start ml-10 text-sm">Ainda não tenho cadastro</a>
                <Button className="grid w-full max-w-md h-12 border" variant={"secondary"}>Fazer Login</Button>
            </Card>
        </div>      
    </div>
  );
}
