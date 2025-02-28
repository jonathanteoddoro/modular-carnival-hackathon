"use client"
import { useState } from "react"
import type React from "react"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "react-hot-toast"
import dayjs from 'dayjs'
import Header from "@/components/Header"


// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any
  }
}

// Contract address
const contractAddress = "0x25b594824a71a093beaCC5Cc786281d4441912e5"

// ABI mínimo necessário para chamar batchMintMedicine
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_medicineName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_batchNumber",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_expirationDate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_pharmacy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "batchMintMedicine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export default function Supplier() {
  // Form state
  const [medicineName, setMedicineName] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [pharmacyAddress, setPharmacyAddress] = useState("")
  const [quantity, setQuantity] = useState("")
  const [status, setStatus] = useState({ type: "", message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState("")

  interface Status {
    type: string
    message: string
  }

  interface FormEvent extends React.FormEvent {}

  // Função para salvar os dados de fornecimento no banco de dados
  const saveSupplyToDatabase = async (data: {
    medicineName: string;
    batchNumber: string;
    expirationDate: number;
    pharmacyWallet: string;
    supplierWallet: string;
    quantity: number;
    transactionHash: string;
  }) => {
    try {
      const response = await fetch('/api/supplies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar dados do fornecimento no banco de dados');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar no banco de dados:', error);
      throw error;
    }
  };

  // Função para chamar a rota de verificação de fraude
  const checkFraud = async () => {
    try {
      const compra = Number(quantity); // A quantidade comprada
      const ano_mes = dayjs().format('YYYY-MM'); // Mês/ano da compra

      // Chamar a rota de verificação de fraude
      const response = await fetch('/api/checkFraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacyWallet: pharmacyAddress,
          medicineName,
          compra,
          ano_mes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.resultado === "Fraude") {
          toast.error("Fraude detectada! A compra não pode ser concluída.");
        } else {
          toast.success("Compra verificada com sucesso.");
        }
      } else {
        throw new Error(data.message || 'Erro ao verificar fraude');
      }
    } catch (error) {
      console.error("Erro na verificação de fraude:", error);
      toast.error("Erro ao verificar fraude");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: "", message: "" })

    if (!medicineName || !batchNumber || !expirationDate || !pharmacyAddress || !quantity) {
      setStatus({ type: "error", message: "Todos os campos são obrigatórios." })
      setIsLoading(false)
      return
    }

    try {
      // Convert date string to Unix timestamp (seconds)
      const expDate = Math.floor(new Date(expirationDate).getTime() / 1000)
      const quantityNum = Number.parseInt(quantity)

      // Check if Ethereum is available
      if (typeof window.ethereum === "undefined") {
        throw new Error("Por favor, instale a MetaMask!")
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Instanciar o provider corretamente para ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const supplierWallet = await signer.getAddress()

      // Criar instância do contrato
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // Chamar função batchMintMedicine
      toast.loading("Processando transação...")
      const tx = await contract.batchMintMedicine(medicineName, batchNumber, expDate, pharmacyAddress, quantityNum)
      setTxHash(tx.hash)

      // Esperar a transação ser confirmada
      await tx.wait()
      toast.dismiss()

      // Salvar os dados no banco de dados
      await saveSupplyToDatabase({
        medicineName,
        batchNumber,
        expirationDate: expDate,
        pharmacyWallet: pharmacyAddress,
        supplierWallet,
        quantity: quantityNum,
        transactionHash: tx.hash
      })

      toast.success("Fornecimento registrado com sucesso!")
      setStatus({
        type: "success",
        message: `Sucesso! ${quantity} unidades de ${medicineName} geradas para a farmácia.`,
      })

      // Chama a função para verificar a fraude após a transação ser concluída
      await checkFraud()

      // Reset form
      setMedicineName("")
      setBatchNumber("")
      setExpirationDate("")
      setPharmacyAddress("")
      setQuantity("")
    } catch (error) {
      console.error("Transaction error:", error)
      toast.dismiss()
      toast.error("Erro na transação")
      setStatus({
        type: "error",
        message: `Erro: ${(error as any).message || "Falha na transação. Verifique se você tem o papel MANUFACTURER_ROLE."}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Gerar venda para farmácia</CardTitle>
            <CardDescription className="text-center">
              Preencha os detalhes do medicamento e da farmácia destino
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status.message && (
              <Alert
                className={`mb-6 ${status.type === "error" ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"}`}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{status.type === "error" ? "Erro" : "Sucesso"}</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="medicineName">Tipo do Remédio</Label>
                <Input
                  id="medicineName"
                  className="h-12"
                  placeholder="Nome do medicamento"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">N° Lote</Label>
                <Input
                  id="batchNumber"
                  className="h-12"
                  placeholder="Número do lote"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Data Validade</Label>
                <Input
                  id="expirationDate"
                  className="h-12"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacyAddress">Farmácia Destino</Label>
                <Input
                  id="pharmacyAddress"
                  className="h-12"
                  placeholder="0x..."
                  value={pharmacyAddress}
                  onChange={(e) => setPharmacyAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  className="h-12"
                  type="number"
                  placeholder="Quantidade de unidades"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              {txHash && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium">Transação:</p>
                  <p className="text-xs text-gray-600 break-all">{txHash}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 bg-[#D5A021]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Gerar Medicamento
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
