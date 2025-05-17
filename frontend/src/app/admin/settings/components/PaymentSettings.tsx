'use client'

import { FaInfoCircle } from 'react-icons/fa'

type PaymentSettingsProps = {
  settings: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PaymentSettings({ settings, handleChange, handleNumberChange }: PaymentSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Payment Configuration</h3>
            <p className="mt-2 text-sm text-blue-700">
              Configure payment settings, cashback percentages, and currency options.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="EGP">Egyptian Pound (EGP)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="currency_symbol" className="block text-sm font-medium text-gray-700">
            Currency Symbol
          </label>
          <input
            type="text"
            name="currency_symbol"
            id="currency_symbol"
            value={settings.currency_symbol}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="cashback_percentage" className="block text-sm font-medium text-gray-700">
            Cashback Percentage (%)
          </label>
          <input
            type="number"
            name="cashback_percentage"
            id="cashback_percentage"
            value={settings.cashback_percentage}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            step="0.1"
            min="0"
            max="10"
          />
        </div>
        
        <div>
          <label htmlFor="commission_percentage" className="block text-sm font-medium text-gray-700">
            Commission Percentage (%)
          </label>
          <input
            type="number"
            name="commission_percentage"
            id="commission_percentage"
            value={settings.commission_percentage}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            step="0.1"
            min="0"
            max="10"
          />
        </div>
      </div>
    </div>
  )
}
