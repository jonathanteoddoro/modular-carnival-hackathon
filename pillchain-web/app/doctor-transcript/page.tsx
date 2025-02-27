"use client"
import Header from "@/components/Header"
import TextField from '@mui/material/TextField'

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MedicalPrescription() {
  const [patientCard, setPatientCard] = useState("")
  const [medications, setMedications] = useState([{ medication: "-Medicamento-", instructions: "Instruções de uso." }])

  const handleAddMedication = () => {
    setMedications([...medications, { medication: "-Medicamento-", instructions: "" }])
  }

interface Medication {
    medication: string;
    instructions: string;
}

const handleMedicationChange = (index: number, value: string) => {
    const newMedications: Medication[] = [...medications];
    newMedications[index].medication = value;
    setMedications(newMedications);
}

interface Medication {
    medication: string;
    instructions: string;
}

const handleInstructionsChange = (index: number, value: string) => {
    const newMedications: Medication[] = [...medications]
    newMedications[index].instructions = value
    setMedications(newMedications)
}

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
      <main className="flex-1 container mx-auto py-12 px-32 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Generate New Prescription */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Gerar nova receita</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <TextField
                  id="patient-card"
                  value={patientCard}
                  onChange={(e) => setPatientCard(e.target.value)}
                  label="Carteira do paciente"
                  variant="outlined"
                  size="medium"
                  fullWidth
                />
              </div>

              {medications.map((med, index) => (
                <div key={index} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor={`medication-${index}`} className="text-sm text-[#3c3c3c]">
                      Medicamento
                    </label>
                    <Select value={med.medication} onValueChange={(value) => handleMedicationChange(index, value)}>
                      <SelectTrigger className="border-[#e0e0e0] flex justify-between">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medicamento">---</SelectItem>
                        <SelectItem value="Dipiroca">Dipiroca</SelectItem>
                        <SelectItem value="Para ce ta mal">Para ce ta mal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <TextField
                      id={`instructions-${index}`}
                      value={med.instructions}
                      onChange={(e) => handleInstructionsChange(index, e.target.value)}
                      label="Instruções do medicamento"
                      variant="outlined"
                      size="medium"
                      fullWidth
                      multiline
                      minRows={4}
                    />
                  </div>
                </div>
              ))}

              <div className="text-left">
                <a href="#" onClick={handleAddMedication} className="text-blue-500 hover:underline">
                  Adicionar novo medicamento
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - View Prescription */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-8">Visualização da receita</h2>
              <hr className="border-t border-black-500 mb-8" />

              <div className="space-y-6">
                <p className="font-medium">Fulano de tal Scarpelano, 18 anos</p>

                {medications.map((med, index) => (
                  <div key={index} className="space-y-1">
                    <p className="font-medium">
                      {med.medication} -{" "}
                      <span className="font-normal">{med.instructions}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Finalize Button */}
            <div className="flex justify-end mt-16">
              <Button className="bg-[#d5a021] hover:bg-[#d5a021]/90 text-white px-32 py-6 rounded-md">
                <Check className="mr-2 h-5 w-5" /> Finalizar receita
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

