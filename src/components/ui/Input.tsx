import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
