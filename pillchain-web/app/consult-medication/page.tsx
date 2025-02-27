// pages/consult-medication.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConsultMedication() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Aqui você pode adicionar a lógica para consultar o medicamento baseado no termo
    console.log("Consultando medicamento:", searchTerm);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold">Consultar Medicamento</h1>
        <Input
          type="text"
          placeholder="Digite o nome do medicamento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4"
        />
        <Button
          variant="outline"
          onClick={handleSearch}
          className="w-full mt-4"
        >
          Consultar Medicamento
        </Button>
        <div className="mt-8">
          {/* Placeholder para resultados de pesquisa */}
          <p>Resultados para: {searchTerm}</p>
          {/* Aqui você pode adicionar uma lista de medicamentos encontrados */}
        </div>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}
