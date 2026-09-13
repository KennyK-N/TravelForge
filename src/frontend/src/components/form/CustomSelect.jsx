import { useMemo, useState } from "react";
import Creatable from "react-select/creatable";
import Label from "@/components/form/Label";

function getMatchScore(value, search) {
  const text = String(value).toLowerCase();

  if (text.startsWith(search)) return 0;

  const index = text.indexOf(search);

  if (index === -1) return Infinity;

  return index;
}

function makeOption(value) {
  return {
    value,
    label: value,
  };
}

function mapToOptions(options = []) {
  return options.map((option) => {
    if (typeof option === "string") {
      return makeOption(option);
    }

    return {
      value: option.value,
      label: option.label ?? option.value,
    };
  });
}

const getSelectClassNames = (error) => ({
  control: (state) => `
  !h-12
  !min-h-12
  !w-full
  !rounded-xl
  !border
  !appearance-none
  !bg-white
  dark:!bg-white/[0.03]
  ${
    error
      ? "!border-red-500 dark:!border-red-500"
      : state.isFocused
        ? "!border-blue-500 dark:!border-blue-500"
        : "!border-gray-300 dark:!border-white/[0.08]"
  }
`,
  valueContainer: () => "!px-4 !py-0 !flex !items-center !h-full",
  placeholder: () => "!text-sm !text-gray-500 dark:!text-gray-500",
  singleValue: () => "!text-sm !text-gray-900 dark:!text-white/90",
  input: () => "!text-sm !text-gray-900 dark:!text-white/90",

  menu: () =>
    "!bg-white dark:!bg-gray-900 !z-50 !overflow-hidden !rounded-lg !border !border-gray-200 dark:!border-white/[0.08]",

  menuList: () => "!p-1",

  option: ({ isFocused, isSelected }) => `
    !cursor-pointer
    !rounded-md
    !px-3
    !py-2
    !text-sm
    ${
      isSelected
        ? "!bg-blue-600 !text-white"
        : isFocused
          ? "!bg-gray-100 !text-gray-900 dark:!bg-white/[0.05] dark:!text-white"
          : "!bg-transparent !text-gray-700 dark:!text-gray-400"
    }
  `,

  multiValue: () => "!rounded-md !bg-gray-100 dark:!bg-white/[0.08]",
  multiValueLabel: () => "!text-gray-700 dark:!text-white/90",
  multiValueRemove: () =>
    "!text-gray-500 hover:!bg-gray-200 hover:!text-gray-700 dark:!text-gray-400 dark:hover:!bg-white/[0.08] dark:hover:!text-white",

  clearIndicator: () =>
    "!text-gray-500 hover:!text-gray-700 dark:!text-gray-500 dark:hover:!text-gray-300",

  dropdownIndicator: () =>
    "!text-gray-500 hover:!text-gray-700 dark:!text-gray-500 dark:hover:!text-gray-300",

  indicatorSeparator: () => "!hidden",
});

function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  label = "",
  name = "",
  isMulti = false,
  labelClassName = "",
  disabled = false,
  error = false,
}) {
  const [selectInput, setSelectInput] = useState("");

  const mappedOptions = useMemo(() => {
    return mapToOptions(options);
  }, [options]);

  const selectedValue = useMemo(() => {
    if (!value) return isMulti ? [] : null;

    const normalizedValue = isMulti
      ? Array.isArray(value)
        ? value
        : [value]
      : [value];

    const selected = mapToOptions(normalizedValue);

    return isMulti ? selected : selected[0];
  }, [value, isMulti]);

  const selectOptions = useMemo(() => {
    if (name !== "toCity") {
      return mappedOptions;
    }

    const search = selectInput.trim().toLowerCase();

    if (!search) {
      return mappedOptions.slice(0, 100);
    }

    return mappedOptions
      .map((item) => ({
        option: item,
        score: getMatchScore(item.value, search),
      }))
      .filter((item) => item.score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .map((item) => item.option)
      .slice(0, 100);
  }, [name, mappedOptions, selectInput]);

  function handleSelectChange(option) {
    if (!onChange) return;

    const nextValue = isMulti
      ? option?.map((item) => item.value) || []
      : option?.value || "";

    onChange(name, nextValue);
  }

  return (
    <div>
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
        </Label>
      )}

      <Creatable
        isMulti={isMulti}
        id={name}
        name={name}
        options={selectOptions}
        value={selectedValue}
        onChange={handleSelectChange}
        inputValue={selectInput}
        onInputChange={(newValue, actionMeta) => {
          if (actionMeta.action === "input-change") {
            setSelectInput(newValue);
          }

          if (actionMeta.action === "menu-close") {
            setSelectInput("");
          }

          return newValue;
        }}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={disabled}
        className={className}
        classNames={getSelectClassNames(error)}
      />
    </div>
  );
}

export default CustomSelect;
