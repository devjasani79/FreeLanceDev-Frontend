'use client';
// Modern spinner covers loader
export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-[9999]">
      <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
}
