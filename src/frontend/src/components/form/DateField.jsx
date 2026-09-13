import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateField({
  id = "",
  name = "",
  formState,
  setFormState,
  className = "",
  disabled = false,
  error = false,
}) {
  const value = formState[name];

  function handleChange(date) {
    setFormState(name, date);
  }

  return (
    <DatePicker
      id={id}
      name={name}
      selected={value}
      onChange={handleChange}
      placeholderText="Select a date"
      disabled={disabled}
      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-hidden 
        focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800
        ${
          error
            ? "!border-red-500 dark:!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
            : "!border-gray-300 dark:!border-gray-700 focus:!border-brand-300"
        }
        ${className}`}
      wrapperClassName="w-full"
      dateFormat="yyyy-MM-dd"
      onKeyDown={(e) => e.preventDefault()}
    />
  );
}
