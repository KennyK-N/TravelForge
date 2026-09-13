function Input({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  autoComplete = "off",
  relative = true,
}) {
  const baseClasses =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3";

  let stateClasses;

  if (disabled) {
    stateClasses =
      "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";
  } else if (error) {
    stateClasses =
      "border-error-500 text-gray-800 focus:border-error-500 focus:ring-error-500/20 dark:border-error-500 dark:text-white/90 dark:focus:border-error-500";
  } else if (success) {
    stateClasses =
      "border-success-500 text-gray-800 focus:border-success-500 focus:ring-success-500/20 dark:border-success-500 dark:text-white/90 dark:focus:border-success-500";
  } else {
    stateClasses =
      "border-gray-300 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";
  }

  return (
    <div className={relative ? "relative" : "w-full"}>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${baseClasses} ${stateClasses} ${className}`}
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
                ? "text-success-500"
                : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export default Input;
