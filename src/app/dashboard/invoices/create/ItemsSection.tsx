"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Database } from "lucide-react"
import type { InvoiceItem } from "@/types/invoiceItem"

interface ItemsSectionProps {
    userId: string
    items: InvoiceItem[]
    onItemsChange: (items: InvoiceItem[]) => void
  }

export function ItemsSection({ userId, items, onItemsChange }: ItemsSectionProps) {

  const addItem = () => {
    onItemsChange([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        amount: null,
      },
    ])
  }

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      onItemsChange(items.filter((item) => item.id !== id))
    }
  }

  const toggleQuantity = (id: string) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, quantity: item.quantity ? undefined : 1 } : item)))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-lg font-semibold mb-4">ITEMS</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Input
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              className="flex-grow"
            />
            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-sm">USD</span>
              <Input
                type="number"
                value={item.amount !== null && item.amount !== undefined ? item.amount : ""}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  updateItem(item.id, { amount: value === "" ? null : Number.parseFloat(value) });
                }}
                className="w-24"
              />
            </div>
            {item.quantity !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm">x</span>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: Number.parseInt(e.target.value) || 1 })}
                  className="w-16"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => toggleQuantity(item.id)}
                title={item.quantity ? "Remove quantity" : "Add quantity"}
              >
                <Database className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={addItem} className="mt-4">
          Add Another Item
        </Button>
      </div>
    </div>
  )
}

