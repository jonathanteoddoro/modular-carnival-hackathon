"use client"
import Header from "@/components/Header"
import { Check } from "lucide-react"
import TextField from '@mui/material/TextField'

export default function Supplyer() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
        <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
          <h1 className="text-center text-2xl font-bold mb-8">
            Gerar venda para
            <br />
            farmácia
          </h1>

          <form className="space-y-4">
            {/* Factory wallet field */}
            <div className="space-y-1">
              <TextField label="Carteira da fábrica" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Pharmacy wallet field */}
            <div className="space-y-1">
              <TextField label="Carteira da farmácia" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Medicine ID field */}
            <div className="space-y-1">
              <TextField label="ID do remédio" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Quantity field */}
            <div className="space-y-1">
              <TextField label="Quantidade" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-[#D5A021] text-white rounded-md py-3 px-6 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Finalizar venda
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

