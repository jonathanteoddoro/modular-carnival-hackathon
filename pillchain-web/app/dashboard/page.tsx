"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AlertTriangle, Book, List, PlusCircle, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();

  // Dados simulados para o gráfico de dispersão (outlier)
  const scatterData = [
    { x: 10, y: 30, z: 200, name: "Farmácia A", color: "blue" },
    { x: 15, y: 35, z: 200, name: "Farmácia B", color: "blue" },
    { x: 12, y: 32, z: 200, name: "Farmácia C", color: "blue" },
    { x: 14, y: 28, z: 200, name: "Farmácia D", color: "blue" },
    { x: 40, y: 50, z: 200, name: "Farmácia Suspeita", color: "red" },
  ];

  // Dados simulados para o gráfico de linha (transações por mês)
  const lineData = [
    { month: "Jan", medicamentos: 65, prescrições: 60, outliers: 2 },
    { month: "Fev", medicamentos: 59, prescrições: 57, outliers: 1 },
    { month: "Mar", medicamentos: 80, prescrições: 76, outliers: 5 },
    { month: "Abr", medicamentos: 81, prescrições: 75, outliers: 7 },
    { month: "Mai", medicamentos: 56, prescrições: 54, outliers: 3 },
    { month: "Jun", medicamentos: 55, prescrições: 54, outliers: 2 },
    { month: "Jul", medicamentos: 72, prescrições: 58, outliers: 14 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Monitoramento de Medicamentos Controlados
        </h1>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            onClick={() => router.push("/fraud-page")}
            className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-red-500"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Farmácias Suspeitas
                  </p>
                  <h2 className="text-3xl font-bold text-red-600">42</h2>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Possível venda sem prescrição médica
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Medicamento Mais Vendido
                  </p>
                  <h2 className="text-2xl font-bold text-red-600">
                    Nimesulida
                  </h2>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Altas vendas no mês atual
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Total de Transações
                  </p>
                  <h2 className="text-3xl font-bold text-blue-600">1,248</h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <List size={24} className="text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Receitas Validadas
                  </p>
                  <h2 className="text-3xl font-bold text-green-600">1,156</h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Book size={24} className="text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Gráfico de Dispersão - Detecção de Outliers
              </CardTitle>
              <p className="text-gray-500 text-sm">
                Vendas x Prescrições por Farmácia
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Vendas" unit=" un" />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Prescrições"
                      unit=" un"
                    />
                    <ZAxis range={[80, 70]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-300 shadow-sm">
                              <p className="font-bold">
                                {payload[0].payload.name}
                              </p>
                              <p>Vendas: {payload[0].value} un</p>
                              <p>Prescrições: {payload[1].value} un</p>
                              {payload[0].payload.color === "red" && (
                                <p className="text-red-600 font-bold">
                                  Possível fraude!
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Scatter
                      name="Farmácias Regulares"
                      data={scatterData.filter((item) => item.color === "blue")}
                      fill="#8884d8"
                    />
                    <Scatter
                      name="Farmácias Suspeitas"
                      data={scatterData.filter((item) => item.color === "red")}
                      fill="#ff0000"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Tendências de Outliers ao Longo do Tempo
              </CardTitle>
              <p className="text-gray-500 text-sm">
                Medicamentos vs Prescrições por Mês
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="medicamentos"
                      stroke="#8884d8"
                      name="Medicamentos Vendidos"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="prescrições"
                      stroke="#82ca9d"
                      name="Prescrições Emitidas"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="outliers"
                      stroke="#ff0000"
                      name="Possíveis Fraudes"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 border h-14 shadow-sm flex items-center justify-center gap-2"
            onClick={() => router.push("/add-medication")}
          >
            <PlusCircle size={20} className="text-blue-600" />
            <span>Adicionar Medicamento</span>
          </Button>

          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 border h-14 shadow-sm flex items-center justify-center gap-2"
            onClick={() => router.push("/consult-medication")}
          >
            <Search size={20} className="text-blue-600" />
            <span>Consultar Medicamento</span>
          </Button>

          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 border h-14 shadow-sm flex items-center justify-center gap-2"
            onClick={() => router.push("/consult-prescription")}
          >
            <Book size={20} className="text-blue-600" />
            <span>Consultar Receita</span>
          </Button>

          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 border h-14 shadow-sm flex items-center justify-center gap-2"
            onClick={() => router.push("/consult-transactions")}
          >
            <List size={20} className="text-blue-600" />
            <span>Consultar Transações</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
