export default function Button({ children, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
