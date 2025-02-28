"use client"
import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Sale {
  id: number
  pharmacyWallet: string
  medicineName: string
  transactionDate: string
  customerWallet: string
  medicineId: number
  transactionHash: string
}

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("/api/sales")
        
        if (!response.ok) {
          throw new Error("Falha ao buscar histórico de vendas")
        }
        
        const data = await response.json()
        setSales(data.sales)
      } catch (error) {
        console.error("Erro ao carregar vendas:", error)
        setError("Não foi possível carregar o histórico de vendas")
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : sales.length === 0 ? (
              <div className="text-center text-gray-500 py-4">Nenhuma venda registrada</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Medicamento</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Farmácia</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Transação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">#{sale.medicineId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sale.medicineName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatAddress(sale.pharmacyWallet)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatAddress(sale.customerWallet)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {format(new Date(sale.transactionDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${sale.transactionHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {formatAddress(sale.transactionHash)}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}