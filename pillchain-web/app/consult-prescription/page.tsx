// pages/consult-prescription.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConsultPrescription() {
  const router = useRouter();
  const [prescriptionId, setPrescriptionId] = useState("");

  const handleSearch = () => {
    // Aqui você pode adicionar a lógica para consultar a receita pelo ID
    console.log("Consultando receita com ID:", prescriptionId);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold">Consultar Receita</h1>
        <Input
          type="text"
          placeholder="Digite o ID da receita"
          value={prescriptionId}
          onChange={(e) => setPrescriptionId(e.target.value)}
          className="mt-4"
        />
        <Button
          variant="outline"
          onClick={handleSearch}
          className="w-full mt-4"
        >
          Consultar Receita
        </Button>
        <div className="mt-8">
          {/* Placeholder para exibir detalhes da receita */}
          <p>Resultado da consulta para a receita ID: {prescriptionId}</p>
          {/* Aqui você pode mostrar os detalhes da receita */}
        </div>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}
