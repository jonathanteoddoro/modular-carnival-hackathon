// pages/add-medication.tsx
"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddMedication() {
  const router = useRouter();
  const [medicationName, setMedicationName] = useState("");
  const [description, setDescription] = useState("");
  const [dose, setDose] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do medicamento
    console.log({ medicationName, description, dose, price });
    router.push("/"); // Redireciona para a página inicial após o envio
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold">Adicionar Medicamento</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input
            type="text"
            placeholder="Nome do Medicamento"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição do Medicamento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Dose recomendada"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Preço do Medicamento"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Button type="submit" variant="outline" className="w-full mt-4">
            Adicionar Medicamento
          </Button>
        </form>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}
