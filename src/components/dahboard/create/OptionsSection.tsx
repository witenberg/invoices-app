"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencies, languages, currencyLabels, languageLabels } from "@/constants/options"
import { InvoiceOptions } from "@/types/invoice"

interface OptionsSectionProps {
  userId: string
  options: InvoiceOptions
  onOptionsChange: (options: InvoiceOptions) => void
}

export function OptionsSection({ userId, options, onOptionsChange }: OptionsSectionProps) {

  const updateOptions = (updates: Partial<InvoiceOptions>) => {
    onOptionsChange({ ...options, ...updates })
  }
  // console.log(options.date)

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-lg font-semibold mb-4">OPTIONS</h2>
      <div className="space-y-6">
        <div>
          <Label>Currency</Label>
          <Select value={options.currency} onValueChange={(value) => updateOptions({ currency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {currencyLabels[curr]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Language</Label>
          <Select value={options.language} onValueChange={(value) => updateOptions({ language: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {languageLabels[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {options.date &&
          <div>
            <Label>Date</Label>
            <Input type="date" value={options.date.split("T")[0]} onChange={(e) => updateOptions({ date: e.target.value })} />
          </div>
        }

        <div>
          <Label>
            Notes
            <span className="text-sm text-gray-500 font-normal ml-2">optional</span>
          </Label>
          <Textarea
            value={options.notes || ""}
            onChange={(e) => updateOptions({ notes: e.target.value })}
            placeholder="Invoice Notes"
            className="mt-1"
          />
        </div>

        <div>
          <Label>
            Discount
            <span className="text-sm text-gray-500 font-normal ml-2">optional</span>
          </Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={options.discount || ""}
              onChange={(e) => updateOptions({ discount: Number(e.target.value) })}
              placeholder="Discount"
              className="w-32"
            />
            <span>%</span>
            <button
              onClick={() => updateOptions({ isDiscountAmount: !options.isDiscountAmount })}
              className="text-blue-600 hover:text-blue-800"
            >
              Use {options.currency} Amount
            </button>
          </div>
        </div>

        <div>
          <Label>
            Sales Tax
            <span className="text-sm text-gray-500 font-normal ml-2">optional</span>
          </Label>
          <div className="flex gap-4">
            <Input
              placeholder="Tax Name (Tax ID)"
              value={options.salestax?.name || ""}
              onChange={(e) =>
                updateOptions({
                  salestax: {
                    name: e.target.value,
                    rate: options.salestax?.rate || 0,
                  },
                })
              }
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="0.00"
              value={options.salestax?.rate || ""}
              onChange={(e) =>
                updateOptions({
                  salestax: {
                    name: options.salestax?.name || "",
                    rate: Number(e.target.value),
                  },
                })
              }
              className="w-32"
            />
            <span className="flex items-center">%</span>
          </div>
        </div>

        <div>
          <Label>
            Second Tax
            <span className="text-sm text-gray-500 font-normal ml-2">optional</span>
          </Label>
          <div className="flex gap-4">
            <Input
              placeholder="Tax Name (Tax ID)"
              value={options.secondtax?.name || ""}
              onChange={(e) =>
                updateOptions({
                  secondtax: {
                    name: e.target.value,
                    rate: options.secondtax?.rate || 0,
                  },
                })
              }
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="0.00"
              value={options.secondtax?.rate || ""}
              onChange={(e) =>
                updateOptions({
                  secondtax: {
                    name: options.secondtax?.name || "",
                    rate: Number(e.target.value),
                  },
                })
              }
              className="w-32"
            />
            <span className="flex items-center">%</span>
          </div>
        </div>

        <div>
          <Label>Payment Methods</Label>
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <div>Accept credit cards</div>
                <div className="text-sm text-gray-500">You must connect Stripe to enable credit card payments</div>
              </div>
              <Switch
                checked={options.acceptcreditcards}
                onCheckedChange={(checked) => updateOptions({ acceptcreditcards: checked })}
                disabled
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div>Accept PayPal</div>
                <div className="text-sm text-gray-500">You must connect PayPal to enable PayPal payments</div>
              </div>
              <Switch
                checked={options.acceptpaypal}
                onCheckedChange={(checked) => updateOptions({ acceptpaypal: checked })}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

