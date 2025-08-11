// src/components/auth/AuthForm.jsx
'use client';
import React from "react";

export default function AuthForm({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-blue-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-white/10 dark:backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-white/20">
        <h1 className="text-2xl font-bold text-foreground dark:text-white text-center mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}
