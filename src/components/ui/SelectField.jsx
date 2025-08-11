export default function SelectField({ label, name, value, onChange, options = [], error }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block mb-1 font-medium">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'
        } focus:outline-none focus:ring-2 focus:ring-primary`}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
