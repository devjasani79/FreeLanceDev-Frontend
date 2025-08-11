export default function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500">×</button>
        {children}
      </div>
    </div>
  );
}
