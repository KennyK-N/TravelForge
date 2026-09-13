import { useState } from "react";

export default function useExpandAccordion(items) {
  const [expand, setExpanded] = useState(items);

  const setExpandedValue = (index) => {
    setExpanded((prev) =>
      prev.map((item) => {
        if (item.id === index) {
          return {
            ...item,
            value: !item.value,
          };
        }

        return item;
      }),
    );
  };
  return {
    expand,
    setExpandedValue,
  };
}
