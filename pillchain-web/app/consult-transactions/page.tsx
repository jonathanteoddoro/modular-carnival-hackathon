"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ethers } from "ethers";
export default function ConsultTransactions() {
  const router = useRouter();
  const [pharmacyWallet, setPharmacyWallet] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contractAddress = "0x25b594824a71a093beaCC5Cc786281d4441912e5";
  const MedicineTrackerABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "AccessControlBadConfirmation",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "neededRole",
          type: "bytes32",
        },
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "ERC721IncorrectOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ERC721InsufficientApproval",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "approver",
          type: "address",
        },
      ],
      name: "ERC721InvalidApprover",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "ERC721InvalidOperator",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "ERC721InvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
      ],
      name: "ERC721InvalidReceiver",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "ERC721InvalidSender",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ERC721NonexistentToken",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
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
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_medicineName",
          type: "string",
        },
        {
          internalType: "address",
          name: "_patient",
          type: "address",
        },
      ],
      name: "issuePrescription",
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
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "batchNumber",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "manufacturer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "pharmacy",
          type: "address",
        },
      ],
      name: "MedicineMinted",
      type: "event",
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "medicineName",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "doctor",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "patient",
          type: "address",
        },
      ],
      name: "PrescriptionIssued",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "callerConfirmation",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
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
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DOCTOR_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MANUFACTURER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "medicines",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "batchNumber",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "expirationDate",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isSold",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
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
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PHARMACY_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "prescriptions",
      outputs: [
        {
          internalType: "address",
          name: "patient",
          type: "address",
        },
        {
          internalType: "string",
          name: "medicineName",
          type: "string",
        },
        {
          internalType: "bool",
          name: "isValid",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
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
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
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
  const handleSearch = async () => {
    if (!pharmacyWallet || !ethers.isAddress(pharmacyWallet)) {
      setError("Por favor, insira um endereço de carteira válido");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const medicineContract = new ethers.Contract(
        contractAddress,
        MedicineTrackerABI,
        signer
      );
      const PHARMACY_ROLE = ethers.keccak256(
        ethers.toUtf8Bytes("PHARMACY_ROLE")
      );
      const isPharmacy = await medicineContract.hasRole(
        PHARMACY_ROLE,
        pharmacyWallet
      );
      if (!isPharmacy) {
        setError("O endereço informado não é de uma farmácia registrada");
        setLoading(false);
        return;
      }
      // Different approach to find medicines
      // Instead of trying to get the total count directly, we'll search for medicines
      // using events or by trying token IDs up to a reasonable limit
      const pharmacyMedicines = [];
      // Approach 1: Try to find tokens by scanning a reasonable range
      // Assuming we won't have millions of medicines, we can check the first 1000 IDs
      const MAX_ID_TO_CHECK = 1000;
      for (let i = 1; i <= MAX_ID_TO_CHECK; i++) {
        try {
          // Try to get the owner of this token ID
          // If the token doesn't exist, this will throw an error and we'll catch it
          const owner = await medicineContract.ownerOf(i);
          // If the pharmacy owns this medicine token
          if (owner.toLowerCase() === pharmacyWallet.toLowerCase()) {
            const medicineDetails = await medicineContract.medicines(i);
            // Only add unsold medicines to the list
            if (!medicineDetails.isSold) {
              pharmacyMedicines.push({
                id: i,
                name: medicineDetails.name,
                batchNumber: medicineDetails.batchNumber,
                expirationDate: new Date(
                  Number(medicineDetails.expirationDate) * 1000
                ).toLocaleDateString(),
                isSold: medicineDetails.isSold,
              });
            }
          }
        } catch (err) {
          // If we get an error for several consecutive IDs, we might have reached
          // the end of our token range
          if (
            i > 1 &&
            pharmacyMedicines.length > 0 &&
            i > pharmacyMedicines[pharmacyMedicines.length - 1].id + 100
          ) {
            // If we haven't found a valid token in the last 100 IDs, we can probably stop looking
            break;
          }
          // Otherwise, just continue to the next ID
        }
      }
      setMedicines(pharmacyMedicines);
    } catch (err) {
      console.error("Error fetching pharmacy medicines:", err);
      setError("Erro ao buscar medicamentos: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center px-6 md:px-32 gap-4 pt-8">
        <Card className="w-full max-w-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Consultar Medicamentos por Farmácia
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col gap-4"
          >
            <TextField
              type="text"
              label="Digite o endereço da carteira da farmácia"
              value={pharmacyWallet}
              onChange={(e) => setPharmacyWallet(e.target.value)}
              fullWidth
              variant="outlined"
              className="bg-gray-50"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="w-1/2 bg-red-500 text-white hover:bg-red-700 h-10"
                disabled={loading}
              >
                {loading ? "Consultando..." : "Consultar Medicamentos"}
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-1/2 bg-gray-400 text-white hover:bg-gray-500 h-10"
                disabled={loading}
              >
                Voltar para a Dashboard
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {medicines.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">
                Medicamentos em posse da farmácia
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left border border-gray-200">
                        ID
                      </th>
                      <th className="p-2 text-left border border-gray-200">
                        Nome
                      </th>
                      <th className="p-2 text-left border border-gray-200">
                        Lote
                      </th>
                      <th className="p-2 text-left border border-gray-200">
                        Data de Validade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine.id} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-200">
                          {medicine.id}
                        </td>
                        <td className="p-2 border border-gray-200">
                          {medicine.name}
                        </td>
                        <td className="p-2 border border-gray-200">
                          {medicine.batchNumber}
                        </td>
                        <td className="p-2 border border-gray-200">
                          {medicine.expirationDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-gray-600 text-sm">
                Total de medicamentos encontrados: {medicines.length}
              </div>
            </div>
          )}
          {medicines.length === 0 && !loading && pharmacyWallet && !error && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
              Nenhum medicamento encontrado para esta farmácia.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
