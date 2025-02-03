'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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


const currencies = ['PLN', 'EUR', 'USD', 'GBP']
const languages = ['Polski', 'English', 'Deutsch', 'Français']

// const ColorPicker = ({ color, setColor }: { color: string, setColor: (color: string) => void }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const predefinedColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']

//   return (
//     <div className="relative">
//       <Button 
//         onClick={() => setIsOpen(!isOpen)} 
//         style={{backgroundColor: color}}
//         className="text-white"
//       >
//         {isOpen ? 'Close' : 'Change color'}
//       </Button>
//       {isOpen && (
//         <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded-md">
//           <Input 
//             type="text" 
//             value={color} 
//             onChange={(e) => setColor(e.target.value)}
//             placeholder="Wpisz kolor (np. #FF0000)"
//           />
//           <div 
//             className="w-full h-10 mt-2" 
//             style={{backgroundColor: color}}
//           ></div>
//           <div className="mt-2 grid grid-cols-3 gap-2">
//             {predefinedColors.map((c) => (
//               <Button 
//                 key={c} 
//                 style={{backgroundColor: c}}
//                 onClick={() => setColor(c)}
//                 className="w-full h-8"
//               ></Button>
//             ))}
//           </div>
//           <Button onClick={() => setIsOpen(false)} className="mt-2 w-full">
//             Zamknij
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

export default function Welcome() {
  const [currency, setCurrency] = useState('')
  const [language, setLanguage] = useState('')
  // const [color, setColor] = useState('#000000')
  const router = useRouter()
  const { data: session, status } = useSession();
  console.log("ID uzytkownika: " + session?.user?.id);
  console.log("session data: ", session);
  
  if (status === 'authenticated') {
    const user = session.user as ExtendedUser;

    if (user.isNewUser !== true) router.push('/invoices');
  }

 

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
        router.push('/invoices')
      } else {
        console.error('Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
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
          {/* <div>
            <Label>Company color</Label>
            <ColorPicker color={color} setColor={setColor} />
          </div> */}
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
}

