"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExtendedUser } from "@/app/actions/user"

interface Client {
  clientid: number
  name: string
  email: string
  address: string | null
}

export function CreateInvoiceForm() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
  })

  useEffect(() => {
    const fetchClients = async () => {
      if (!(session?.user as ExtendedUser)?.userid) return

      const response = await fetch(`/api/clients?userId=${(session?.user as ExtendedUser).userid}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    }

    fetchClients()
  }, [session])

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.clientid.toString() === clientId)
    if (client) {
      setSelectedClient(client)
      setFormData({
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address || "",
      })
    } else {
      setSelectedClient(null)
      setFormData({
        clientName: "",
        clientEmail: "",
        clientAddress: "",
      })
    }
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">CLIENT</h2>
          <div className="space-y-4">
            <div>
              <Select onValueChange={handleClientSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="New Client" />
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Client Name"
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                  placeholder="Client Email"
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientAddress: e.target.value }))}
                  placeholder="Client Address"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">NEW</div>
            <div className="text-2xl font-bold">USD 0.00</div>
            <div className="text-sm text-gray-500">No client selected</div>
          </div>
        </div>
      </div>
    </div>
  )
}

