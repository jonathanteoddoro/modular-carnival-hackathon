// pages/consult-medication.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
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
      <div className="flex flex-col items-center px-6 md:px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-800">Consultar Medicamento</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-4 mt-6 w-full max-w-lg">
          <TextField
            type="text"
            label="Digite o nome do medicamento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            className="bg-gray-50"
          />
          <Button type="submit" className="w-full mt-4 bg-red-500 text-white hover:bg-red-700 h-10 max-w-xs mx-auto">
            Consultar Medicamento
          </Button>
        </form>
        <Button onClick={() => router.push("/dashboard")} className="w-full mt-2 bg-gray-400 text-white hover:bg-gray-400 h-10 max-w-xs mx-auto">
          Voltar para a Dashboard
        </Button>
      </div>
    </div>
  );
}
