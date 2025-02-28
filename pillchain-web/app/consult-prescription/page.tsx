"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";

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
      <div className="flex flex-col items-center px-6 md:px-32 gap-4 pt-8">
        <Card className="w-full max-w-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultar Receita</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-4">
            <TextField
              type="text"
              label="Digite o ID da receita"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              fullWidth
              variant="outlined"
              className="bg-gray-50"
            />
            <div className="flex gap-2">
              <Button type="submit" className="w-1/2 bg-red-500 text-white hover:bg-red-700 h-10">
                Consultar Receita
              </Button>
              <Button onClick={() => router.push("/dashboard")} className="w-1/2 bg-gray-400 text-white hover:bg-gray-400 h-10">
                Voltar para a Dashboard
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
