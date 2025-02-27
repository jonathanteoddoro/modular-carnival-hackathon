"use client"
import TextField from '@mui/material/TextField'
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
        <main className="flex-1 container mx-auto flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
            <h1 className="text-center text-2xl font-bold mb-8">Já é usuário?</h1>
            <form className="space-y-4">
              <div className="space-y-1">
                <TextField label="CNPJ" variant="outlined" size="medium" fullWidth />
              </div>
              <div className="mt-2">
                <a href="/drugstore-signup" className="text-blue-500 hover:underline">Minha farmácia ainda não tem cadastro</a>
              </div>
              <div className="pt-4 flex justify-center">
                <Button className="bg-[#D5A021] text-white rounded-md py-3 px-6 flex items-center justify-center gap-2">
                  Fazer Login
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
