"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Client } from "@/types/client"

interface ClientSectionProps {
  userId: string
  formData: {
    clientName: string
    clientEmail: string
    clientAddress: string
  }
  onFormDataChange: (data: {
    clientName: string
    clientEmail: string
    clientAddress: string
  }) => void
  onClientSelect: (clientId: number | null) => void
}

export function ClientSection({ userId, formData, onFormDataChange, onClientSelect }: ClientSectionProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  // console.log(formData?.clientName)
  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch(`/api/clients?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    }

    fetchClients()
  }, [userId])

  useEffect(() => {
    if (formData.clientName) {
      const client = clients.find((client) => client.name === formData.clientName)
      if (client) {
        setSelectedClient(client)
      }
    }
  }, [formData.clientName, clients])

  const handleClientSelect = (clientId: string) => {
    if (clientId === "new") {
      setSelectedClient(null)
      onFormDataChange({
        clientName: "",
        clientEmail: "",
        clientAddress: "",
      })
      onClientSelect(null)
      return
    }

    const client = clients.find((c) => c.clientid.toString() === clientId)
    if (client) {
      setSelectedClient(client)
      onFormDataChange({
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address || "",
      })
      onClientSelect(client.clientid)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">CLIENT</h2>
      <div className="space-y-4">
        <div>
        <Select onValueChange={handleClientSelect} value={selectedClient ? selectedClient.clientid.toString() : "new"}>
            <SelectTrigger>
              <SelectValue placeholder={ formData?.clientName || "New Client" } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New Client</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.clientid} value={client.clientid.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => onFormDataChange({ ...formData, clientName: e.target.value })}
              placeholder="Client Name"
              disabled={!!selectedClient}
              required
            />
          </div>

          <div>
            <Label htmlFor="clientEmail">
              Client Email
              {/* <span className="text-sm text-gray-500 font-normal ml-2">Separate multiple emails with ;</span> */}
            </Label>
            <Input
              id="clientEmail"
              value={formData.clientEmail}
              onChange={(e) => onFormDataChange({ ...formData, clientEmail: e.target.value })}
              placeholder="Client Email"
              disabled={!!selectedClient}
              required
            />
          </div>

          <div>
            <Label htmlFor="clientAddress">
              Client Address
              <span className="text-sm text-gray-500 font-normal ml-2">optional</span>
            </Label>
            <Input
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => onFormDataChange({ ...formData, clientAddress: e.target.value })}
              placeholder="Client Address"
              disabled={!!selectedClient}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

