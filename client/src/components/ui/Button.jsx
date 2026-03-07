const Button = ({ children, loading, variant = "primary", ...props }) => {
  const base =
    "w-full py-3 px-6 font-display tracking-widest text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-dark hover:bg-yellow-300 active:scale-95",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-dark",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="border-dark h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
