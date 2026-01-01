const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false, className = "" }) => {
  return (
    <div className={`flex flex-col mb-5 ${className}`}>
      {label && <label className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white"
      />
    </div>
  );
};

export default Input;
