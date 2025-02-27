"use client"
import { useState } from "react";
import Header from "@/components/Header";
import { Check, AlertCircle } from "lucide-react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

// ABI only containing the sellMedicine function and relevant errors to reduce size
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_patient",
        "type": "address"
      }
    ],
    "name": "sellMedicine",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "pharmacy",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "MedicineSold",
    "type": "event"
  }
];

const CONTRACT_ADDRESS = "0x25b594824a71a093beaCC5Cc786281d4441912e5";

export default function DrugstoreSell() {
  const router = useRouter();
  const [medicineId, setMedicineId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleMedicineIdChange = (e) => {
    setMedicineId(e.target.value);
  };

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value);
  };

  const sellMedicine = async (e) => {
    e.preventDefault();
    
    if (!medicineId || !customerId) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    try {
      setLoading(true);
      
      // Validate the customer address
      if (!ethers.isAddress(customerId)) {
        toast.error("Endereço de cliente inválido");
        setLoading(false);
        return;
      }
      
      // Connect to the Ethereum provider
      if (!window.ethereum) {
        toast.error("Por favor, instale a MetaMask ou outro provedor Ethereum");
        setLoading(false);
        return;
      }
      
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      
      // Call the sellMedicine function
      const tokenId = parseInt(medicineId);
      const patientAddress = customerId;
      
      // Execute the transaction
      const tx = await contract.sellMedicine(tokenId, patientAddress);
      setTxHash(tx.hash);
      
      // Wait for transaction to be mined
      toast.loading("Processando transação...");
      await tx.wait();
      
      toast.dismiss();
      toast.success("Venda realizada com sucesso!");
      
      // Reset form
      setMedicineId("");
      setCustomerId("");
      
    } catch (error) {
      console.error("Erro ao vender remédio:", error);
      let errorMessage = "Erro ao processar a venda";
      
      // Parse error message
      if (error.message) {
        if (error.message.includes("AccessControlUnauthorizedAccount")) {
          errorMessage = "Permissão negada: Sua conta não tem o papel de farmácia";
        } else if (error.message.includes("ERC721NonexistentToken")) {
          errorMessage = "ID do remédio não existe";
        } else if (error.message.includes("user rejected transaction")) {
          errorMessage = "Transação rejeitada pelo usuário";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
          <h1 className="text-center text-2xl font-bold mb-8">
            Gerar venda para
            <br />
            Cliente
          </h1>

          <form className="space-y-4" onSubmit={sellMedicine}>
            {/* Medicine ID field */}
            <div className="space-y-1">
              <TextField 
                label="Id Remédio" 
                variant="outlined" 
                size="medium" 
                fullWidth 
                value={medicineId} 
                onChange={handleMedicineIdChange}
                type="number"
                required
              />
            </div>

            {/* Customer ID field */}
            <div className="space-y-1">
              <TextField 
                label="Endereço do Cliente" 
                variant="outlined" 
                size="medium" 
                fullWidth 
                value={customerId} 
                onChange={handleCustomerIdChange}
                required
                placeholder="0x..."
              />
            </div>

            {/* Transaction hash display (if available) */}
            {txHash && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium">Transação:</p>
                <p className="text-xs text-gray-600 break-all">{txHash}</p>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#D5A021] h-12 w-full text-white hover:bg-[#D5B025] rounded-md py-3 px-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check size={18} />
                )}
                {loading ? "Processando..." : "Finalizar venda"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Alert button */}
      <button
        className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        onClick={() => router.push("/theft-page")}
      >
        <AlertCircle size={24} />
      </button>
    </div>
  );
}