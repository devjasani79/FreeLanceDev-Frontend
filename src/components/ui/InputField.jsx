// src/components/auth/InputField.jsx
'use client';
import React from "react";

export default function InputField({ label, type = "text", name, value, onChange, required, placeholder }) {
  const id = name;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
