// pages/consult-transactions.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConsultTransactions() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");

  const handleSearch = () => {
    // Aqui você pode adicionar a lógica para consultar a transação
    console.log("Consultando transação com ID:", transactionId);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center px-6 md:px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-800">Consultar Transações</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-4 mt-6 w-full max-w-lg">
          <TextField
            type="text"
            label="Digite o ID da transação"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <Button type="submit" className="w-full mt-4 bg-red-500 text-white hover:bg-red-700 h-10 max-w-lg">
            Consultar Transação
          </Button>
        </form>
        <Button onClick={() => router.push("/dashboard")} className="w-full mt-2 bg-gray-400 text-white hover:bg-gray-400 h-10 max-w-lg">
          Voltar para a Dashboard
        </Button>
      </div>
    </div>
  );
}
