function SubmitButton({
  children,
  type = "button",
  size = "md",
  variant = "send",
  onClick,
  className = "",
  disabled = false,
}) {
  // Size Classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
  };

  // Variant Classes
  const variantClasses = {
    send: "bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full flex items-center justify-center flex-shrink-0
        transition-all
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
