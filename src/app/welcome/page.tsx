'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ExtendedUser } from '../actions/user'
import { currencies, languages } from '@/constants/options'


export default function Welcome() {
  const [currency, setCurrency] = useState('')
  const [language, setLanguage] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const user = session?.user as ExtendedUser;
      if (user.isNewUser === false) {
        router.push('/dashboard/invoices');
      } else {
        setLoading(false);
      }
    }
  }, [status, session]);

  const id = session?.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/update-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, currency, language }),
      })

      if (response.ok) {
        router.push('/dashboard/invoices')
      } else {
        console.error('Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currency">Default currency</Label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger>
                <SelectValue placeholder="Choose currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language">Default language</Label>
            <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger>
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
}
