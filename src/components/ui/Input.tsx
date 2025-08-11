import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#062038] mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 border rounded-lg bg-white
          focus:outline-none focus:ring-2 focus:ring-[#FE6000] focus:border-transparent
          transition-all duration-200
          ${error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-[#0C4579]'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};