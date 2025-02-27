// pages/consult-transactions.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold">Consultar Transações</h1>
        <Input
          type="text"
          placeholder="Digite o ID da transação"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="mt-4"
        />
        <Button
          variant="outline"
          onClick={handleSearch}
          className="w-full mt-4"
        >
          Consultar Transação
        </Button>
        <div className="mt-8">
          {/* Placeholder para exibir detalhes da transação */}
          <p>Resultado da consulta para transação ID: {transactionId}</p>
          {/* Aqui você pode mostrar os detalhes da transação */}
        </div>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}
