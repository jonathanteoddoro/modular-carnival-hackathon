"use client"
import { useState } from "react";
import Header from "@/components/Header";
import { Check, AlertCircle } from "lucide-react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DrugstoreSell() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
          <h1 className="text-center text-2xl font-bold mb-8">
            Gerar venda para
            <br />
            Cliente
          </h1>

          <form className="space-y-4">
            {/* Factory wallet field */}
            <div className="space-y-1">
              <TextField label="Id Remédio" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Quantity field */}
            <div className="space-y-1">
              <TextField label="Id do Cliente" variant="outlined" size="medium" fullWidth />
            </div>

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="bg-[#D5A021] h-12 w-full text-white hover:bg-[#D5B025] rounded-md py-3 px-6 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Finalizar venda
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Botão de alerta */}
      <button
        className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        onClick={() => router.push("/theft-page")}
      >
        <AlertCircle size={24} />
      </button>
    </div>
  );
}
