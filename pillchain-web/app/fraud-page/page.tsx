"use client"
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const farmacias = [
  { id: 1, nome: "Farmácia Central", cidade: "São Paulo" },
  { id: 2, nome: "Drogaria Saúde", cidade: "Rio de Janeiro" },
  { id: 3, nome: "Farmamed", cidade: "Belo Horizonte" },
  { id: 4, nome: "Drogaria Bem-Estar", cidade: "Curitiba" },
  { id: 5, nome: "FarmaTotal", cidade: "Porto Alegre" },
];

export default function Fraude() {
  return (
    <div>
      <Header />
      <div className="px-32 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Farmácias suspeitas de fraude</h1>
        <Card className="p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Cidade</th>
                <th className="text-center p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {farmacias.map((farmacia) => (
                <tr key={farmacia.id} className="border-b">
                  <td className="p-2">{farmacia.nome}</td>
                  <td className="p-2">{farmacia.cidade}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <Button variant="outline">Ler Relatório</Button>
                    <Button variant="destructive">Mandar Auditoria</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
