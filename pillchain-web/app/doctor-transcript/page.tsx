"use client"
import Header from "@/components/Header"
import TextField from "@mui/material/TextField"
import { useState, useEffect } from "react"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ethers } from "ethers"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Endereço do contrato
const contractAddress = "0x25b594824a71a093beaCC5Cc786281d4441912e5"
const contractABI = [
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
]

export default function MedicalPrescription() {
  const [patientCard, setPatientCard] = useState("")
  const [medications, setMedications] = useState([{ medication: "-Medicamento-", instructions: "Instruções de uso." }])
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState("")
  const [isDoctor, setIsDoctor] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [patientName, setPatientName] = useState("Fulano de tal Scarpelano, 18 anos")

  useEffect(() => {
    const initContract = async () => {
      try {
        if (!window.ethereum) {
          setError("Por favor, instale MetaMask para usar esta aplicação.")
          return
        }

        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Criando provedor e assinante (signer) com ethers v6
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        // Criando instância do contrato
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        setContract(contractInstance)

        // Verificando se o usuário tem o papel de médico
        const doctorRole = await contractInstance.DOCTOR_ROLE()
        const hasDocRole = await contractInstance.hasRole(doctorRole, address)
        setIsDoctor(hasDocRole)

        if (!hasDocRole) {
          setError("Você não tem permissão de médico no contrato. Algumas funções estarão indisponíveis.")
        }
      } catch (err) {
        console.error("Erro ao inicializar contrato:", err)
        setError("Falha ao conectar com a blockchain. Verifique sua carteira.")
      }
    }

    initContract()

    // Listener para mudança de conta no MetaMask
    window.ethereum?.on("accountsChanged", () => window.location.reload())

    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {})
    }
  }, [])

  const handleAddMedication = () => {
    setMedications([...medications, { medication: "-Medicamento-", instructions: "" }])
  }

  const handleMedicationChange = (index: number, value: string) => {
    const newMedications = [...medications]
    newMedications[index].medication = value
    setMedications(newMedications)
  }

  const handleInstructionsChange = (index: number, value: string) => {
    const newMedications = [...medications]
    newMedications[index].instructions = value
    setMedications(newMedications)
  }

  const handleDeleteMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index)
    setMedications(newMedications)
  }

  const issuePrescription = async () => {
    if (!ethers.isAddress(patientCard)) {
      setError("Endereço da carteira do paciente inválido")
      return
    }

    if (medications.length === 0 || medications[0].medication === "-Medicamento-") {
      setError("Selecione pelo menos um medicamento")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!contract) {
        throw new Error("Contrato não carregado corretamente.")
      }

      for (const med of medications) {
        if (med.medication !== "-Medicamento-") {
          const tx = await contract.issuePrescription(med.medication, patientCard)
          await tx.wait()
        }
      }

      setSuccess("Receita emitida com sucesso na blockchain!")
    } catch (err) {
      console.error("Erro ao emitir receita:", err)
      setError("Falha ao emitir receita. Verifique se você tem permissão de médico.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-6 md:px-6 lg:px-32">
        {error && (
          <Alert variant="destructive" className="mb-6 border-l-4 border-red-600 shadow-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border border-green-200 border-l-4 border-l-green-600 shadow-sm">
            <AlertDescription className="text-green-700 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              {success}
            </AlertDescription>
          </Alert>
        )}

        {!account ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border p-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <p className="text-gray-700 font-medium">Conectando à sua carteira...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Gerar nova receita</h2>
              <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg mb-6 flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                Conectado como: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                {isDoctor ? (
                  <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Médico
                  </span>
                ) : (
                  <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Não é médico
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <TextField
                  value={patientCard}
                  onChange={(e) => setPatientCard(e.target.value)}
                  label="Carteira do paciente"
                  fullWidth
                  placeholder="0x..."
                  variant="outlined"
                  className="bg-gray-50"
                />

                <div className="h-4"></div> {/* Small space between patient wallet input and medication selection */}

                {medications.map((med, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-100 rounded-lg bg-gray-50 relative">
                    <p className="text-sm font-medium text-gray-500">Medicamento {index + 1}</p>
                    <Select value={med.medication} onValueChange={(value) => handleMedicationChange(index, value)}>
                      <SelectTrigger className="border-gray-200 bg-white shadow-sm">
                        <SelectValue placeholder="Selecione um medicamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-Medicamento-">---</SelectItem>
                        <SelectItem value="AMOXICILINA">AMOXICILINA</SelectItem>
                        <SelectItem value="DIAZEPAM">DIAZEPAM</SelectItem>
                        <SelectItem value="RITALINA">RITALINA</SelectItem>
                        <SelectItem value="MORFINA">MORFINA</SelectItem>
                        <SelectItem value="OXICODONA">OXICODONA</SelectItem>
                        <SelectItem value="CLONAZEPAM">CLONAZEPAM</SelectItem>
                        <SelectItem value="METFORMINA">METFORMINA</SelectItem>
                        <SelectItem value="LOSARTANA">LOSARTANA</SelectItem>
                        <SelectItem value="SERTRALINA">SERTRALINA</SelectItem>

                      </SelectContent>
                    </Select>

                    <TextField
                      value={med.instructions}
                      onChange={(e) => handleInstructionsChange(index, e.target.value)}
                      label="Instruções do medicamento"
                      fullWidth
                      multiline
                      minRows={4}
                      variant="outlined"
                      className="bg-white"
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMedication(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <a
                  onClick={handleAddMedication}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Adicionar novo medicamento
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Visualização da receita</h2>

              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-dashed border-gray-200 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-bold text-xl text-gray-800">{patientName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {patientCard ? (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{patientCard}</span>
                      ) : (
                        "Endereço não informado"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                      <p className="font-bold text-gray-800">
                        {med.medication !== "-Medicamento-" ? med.medication : "Medicamento não selecionado"}
                      </p>
                      <p className="text-gray-600 mt-1">{med.instructions}</p>
                    </div>
                  ))}

                  {medications.length === 0 ||
                  (medications.length === 1 && medications[0].medication === "-Medicamento-") ? (
                    <p className="text-gray-400 italic text-center py-4">Nenhum medicamento adicionado</p>
                  ) : null}
                </div>
              </div>

              <Button
                className={`${isDoctor ? "bg-[#d5a021] hover:bg-[#c08c10]" : "bg-gray-400"} text-white shadow-sm transition-all duration-200 py-6`}
                onClick={issuePrescription}
                disabled={loading || !isDoctor}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </div>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Finalizar receita
                  </>
                )}
              </Button>

              {!isDoctor && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Você precisa de permissão de médico para emitir receitas
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

