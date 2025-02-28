"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface Fraud {
  id: number;
  pharmacyName: string;
  description: string;
  status: string;
  severity: string;
  reportedDate: string;
}

export default function Fraude() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [frauds, setFrauds] = useState<Fraud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrauds = async () => {
      try {
        const response = await fetch('/api/frauds');
        if (!response.ok) throw new Error('Failed to fetch fraud data');
        const data = await response.json();
        setFrauds(data);
      } catch (error) {
        console.error('Error fetching fraud data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFrauds();
  }, []);

  const filteredFrauds = frauds.filter(
    (fraud) =>
      fraud.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-32 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <ShieldAlert className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Farmácias{" "}
              <span className="text-red-600">suspeitas de fraude</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar farmácia..."
                className="pl-10 bg-white border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para a Dashboard
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-gray-200 shadow-md">
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
              Lista de Farmácias Suspeitas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Severidade
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Data Reportada
                  </th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : filteredFrauds.length > 0 ? (
                  filteredFrauds.map((fraud) => (
                    <tr
                      key={fraud.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-gray-900 font-medium">
                        {fraud.pharmacyName}
                      </td>
                      <td className="p-4">
                        <Badge className={getSeverityColor(fraud.severity)}>
                          {fraud.severity}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-900">
                        {fraud.status}
                      </td>
                      <td className="p-4 text-gray-900">
                        {new Date(fraud.reportedDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() => router.push(`/fraud-page/${fraud.id}/report`)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Relatório
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center"
                            onClick={() => router.push(`/fraud-page/${fraud.id}/audit`)}
                          >
                            <ShieldAlert className="h-4 w-4 mr-1" />
                            Auditoria
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Nenhuma farmácia encontrada com os critérios de busca.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-500">
            Mostrando {filteredFrauds.length} de {frauds.length} farmácias
            suspeitas
          </div>
        </Card>
      </div>
    </div>
  );
}
