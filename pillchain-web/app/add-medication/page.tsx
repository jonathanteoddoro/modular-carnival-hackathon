"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Dropdown } from "@/components/ui/dropdown";
import { contractABI, contractAddress } from "@/app/contract";

// Declarando a interface global para window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function AddMedication() {
  const router = useRouter();
  const [medicationName, setMedicationName] = useState("");
  const [description, setDescription] = useState("");
  const [lote, setLote] = useState("");
  const [validity, setValidity] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState("false");
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const web3Contract = new Contract(contractAddress, contractABI, web3Signer);
          
          setProvider(web3Provider);
          setSigner(web3Signer);
          setContract(web3Contract);
        } catch (error) {
          console.error("Erro ao conectar com o contrato:", error);
        }
      } else {
        console.error("MetaMask não detectado!");
      }
    };

    loadBlockchainData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timestampValidity = Math.floor(new Date(validity).getTime() / 1000); // Converte para timestamp Unix

    try {
      if (!contract) {
        alert("Contrato não carregado corretamente");
        return;
      }

      const tx = await contract.mintMedicine(medicationName, lote, timestampValidity, prescriptionRequired === "true");
      await tx.wait();
      alert("Medicamento criado na blockchain!");

    } catch (error) {
      console.error("Erro ao criar medicamento na blockchain:", error);
      alert("Erro ao criar medicamento.");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col px-32 gap-4 pt-8">
        <h1 className="text-3xl font-bold">Adicionar Medicamento</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input
            type="text"
            placeholder="Nome do Medicamento"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição do Medicamento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Lote do Medicamento"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            required
          />
          <Input
            type="date"
            placeholder="Data de Validade"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            required
          />
          <Dropdown
            value={prescriptionRequired}
            onChange={(e) => setPrescriptionRequired(e.target.value)}
            required
            options={["true", "false"]}
          />
          <Button type="submit" variant="outline" className="w-full mt-4">
            Adicionar Medicamento na Blockchain
          </Button>
        </form>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-4">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}