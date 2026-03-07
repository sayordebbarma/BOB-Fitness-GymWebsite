const Input = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`focus:border-primary w-full rounded-none border bg-transparent px-4 py-3 text-sm text-white transition-all duration-200 outline-none placeholder:text-gray-600 ${error ? "border-red-500" : "border-border"} `}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
