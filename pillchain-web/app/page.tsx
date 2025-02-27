"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AlertTriangle, Book, List, PlusCircle, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <div className="flex flex-row px-32 gap-4 pt-8">
        
        {/* Card de alerta que leva para a página de farmácias suspeitas */}
        <Card 
          onClick={() => router.push("/fraud-page")} 
          className="w-full h-36 p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-600" />
            <h1 className="text-3xl font-bold text-red-600">42</h1>
          </div>
          <p className="text-gray-600">
            Farmácias suspeitas de estarem vendendo medicamentos controlados sem prescrição médica.
          </p>
        </Card>

        {/* Card do medicamento mais vendido */}
        <Card className="w-full h-36 p-8 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-600" />
            <h1 className="text-3xl font-bold text-red-600">Nimesulida</h1>
          </div>
          <p className="text-gray-600">
            Medicamento controlado mais vendido no mês atual.
          </p>
        </Card>
      </div>  
      <div className="flex flex-row h-94 w-full px-32 gap-4 pt-8">
        <Card className="w-full"></Card>
      </div>
        
      {/* Botões de ação */}
      <div className="flex flex-row h-16 w-full px-32 gap-6 pt-8">
        <Button variant="outline" className="w-full flex items-center justify-center h-12" onClick={() => router.push("/add-medication")}>
          <PlusCircle size={24} />
          <p> Adicionar Medicamento</p>
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center h-12" onClick={() => router.push("/consult-medication")}>
          <Search size={24} />
          <p> Consultar Medicamento</p>
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center h-12" onClick={() => router.push("/consult-prescription")}>
          <Book size={24} />
          <p> Consultar Receita</p>
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center h-12" onClick={() => router.push("/consult-transactions")}>
          <List size={24} />
          <p> Consultar Transações</p>
        </Button>
      </div>
    </div>
  );
}
