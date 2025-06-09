'use client'

import { useState } from 'react'

export default function Input({
  label,
  type = 'text',
  placeholder,
  icon,
  name,
  isPassword = false,
  className = '',
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [value, setValue] = useState('')

  function handlechange(e) {
    onChange(e, name)
    setValue(e.target.value)
  }

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handlechange}
          className={`w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
            icon || isPassword ? 'pr-12' : ''
          } ${className}`}
        />
        {(icon || isPassword) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            ) : (
              <span className="text-slate-400">{icon}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
