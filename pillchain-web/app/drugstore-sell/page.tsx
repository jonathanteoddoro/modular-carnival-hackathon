"use client";
import { useState } from "react";
import type React from "react";

import Header from "@/components/Header";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

// ABI only containing the sellMedicine function and relevant errors to reduce size
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "sellMedicine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pharmacy",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
    ],
    name: "MedicineSold",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getMedicineName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0x25b594824a71a093beaCC5Cc786281d4441912e5";

export default function DrugstoreSell() {
  const router = useRouter();
  const [medicineId, setMedicineId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleMedicineIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicineId(e.target.value);
  };

  const handleCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value);
  };

  // Função para salvar os dados da venda no banco de dados
  const saveSaleToDatabase = async (data: {
    pharmacyWallet: string;
    medicineName: string;
    customerWallet: string;
    medicineId: number;
    transactionHash: string;
  }) => {
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar dados da venda no banco de dados");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao salvar no banco de dados:", error);
      throw error;
    }
  };

  const sellMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!medicineId || !customerId) {
      setStatus({
        type: "error",
        message: "Por favor, preencha todos os campos",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      // Validate the customer address
      if (!ethers.isAddress(customerId)) {
        setStatus({ type: "error", message: "Endereço de cliente inválido" });
        return;
      }

      // Connect to the Ethereum provider
      if (!window.ethereum) {
        setStatus({
          type: "error",
          message: "Por favor, instale a MetaMask ou outro provedor Ethereum",
        });
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const pharmacyWallet = await signer.getAddress();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Get medicine name (adicionando chamada para obter o nome do remédio)
      const tokenId = Number.parseInt(medicineId);
      let medicineName = "Desconhecido";

      try {
        medicineName = await contract.getMedicineName(tokenId);
      } catch (error) {
        console.warn("Não foi possível obter o nome do remédio:", error);
      }

      // Call the sellMedicine function
      const patientAddress = customerId;

      // Execute the transaction
      const tx = await contract.sellMedicine(tokenId, patientAddress);
      setTxHash(tx.hash);

      // Wait for transaction to be mined
      toast.loading("Processando transação...");
      await tx.wait();

      // Salvar os dados da venda no banco de dados
      await saveSaleToDatabase({
        pharmacyWallet,
        medicineName,
        customerWallet: patientAddress,
        medicineId: tokenId,
        transactionHash: tx.hash,
      });

      toast.dismiss();
      toast.success("Venda registrada no histórico!");
      setStatus({
        type: "success",
        message: "Venda realizada e registrada com sucesso!",
      });

      // Reset form
      setMedicineId("");
      setCustomerId("");
    } catch (error: any) {
      console.error("Erro ao vender remédio:", error);
      let errorMessage =
        "Prescrição médida inválida. O usuário não tem permissão para realizar essa compra!";

      // Parse error message
      if (error.message) {
        if (error.message.includes("AccessControlUnauthorizedAccount")) {
          errorMessage =
            "Permissão negada: Sua conta não tem o papel de farmácia";
        } else if (error.message.includes("ERC721NonexistentToken")) {
          errorMessage = "ID do remédio não existe";
        } else if (error.message.includes("user rejected transaction")) {
          errorMessage = "Transação rejeitada pelo usuário";
        }
      }

      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Gerar venda para Cliente
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os detalhes da venda do medicamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status.message && (
              <Alert
                className={`mb-6 ${
                  status.type === "error"
                    ? "bg-red-50 text-red-900"
                    : "bg-green-50 text-green-900"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {status.type === "error" ? "Erro" : "Sucesso"}
                </AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={sellMedicine}>
              <div className="space-y-2">
                <Label htmlFor="medicineId">ID do Remédio</Label>
                <Input
                  className="h-12"
                  id="medicineId"
                  type="number"
                  placeholder="Digite o ID do remédio"
                  value={medicineId}
                  onChange={handleMedicineIdChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Endereço do Cliente</Label>
                <Input
                  className="h-12"
                  id="customerId"
                  placeholder="0x..."
                  value={customerId}
                  onChange={handleCustomerIdChange}
                  required
                />
              </div>

              {txHash && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium">Transação:</p>
                  <p className="text-xs text-gray-600 break-all">{txHash}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#D5A021]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Finalizar venda
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Button
        variant="destructive"
        className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg"
        onClick={() => router.push("/theft-page")}
      >
        <AlertCircle size={24} />
      </Button>
    </div>
  );
}
