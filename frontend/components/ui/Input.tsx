'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  className?: string;
  error?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  className = '',
  error,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-surface-input border border-border-input rounded-lg 
            px-5 py-4 text-white placeholder:text-white/40 
            focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 
            outline-none transition-all
            ${type === 'date' ? '[color-scheme:dark]' : ''}
            ${className}
          `}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
}
