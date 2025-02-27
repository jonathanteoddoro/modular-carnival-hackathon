"use client"
import { useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";

export default function ReportTheft() {
  const router = useRouter();
  const [medicineType, setMedicineType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reportFile, setReportFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ medicineType, quantity, reportFile });
    // Aqui você pode enviar os dados para uma API ou banco de dados
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-md shadow-sm border border-[#e0e0e0] p-8">
          <h1 className="text-center text-2xl font-bold mb-8">Reportar Roubo de Medicamento</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <TextField 
                label="Tipo do Remédio" 
                variant="outlined" 
                size="medium" 
                fullWidth 
                value={medicineType}
                onChange={(e) => setMedicineType(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <TextField 
                label="Quantidade Roubada" 
                type="number" 
                variant="outlined" 
                size="medium" 
                fullWidth 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Input de Arquivo Melhorado */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Anexar Boletim de Ocorrência</label>
              <div className="flex justify-center">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none">
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste o arquivo</p>
                    <p className="text-xs text-gray-500">Aceita arquivos PDF, JPG ou PNG</p>
                  </div>
                  <input 
                    id="dropzone-file" 
                    type="file" 
                    accept=".pdf,.jpg,.png" 
                    className="hidden"
                    onChange={(e) => setReportFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button className="bg-red-500 w-full h-12">Reportar Roubo</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
