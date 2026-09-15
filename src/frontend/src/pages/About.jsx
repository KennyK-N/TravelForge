import { useState } from "react";

import Accordion from "@components/ui/Accordion";
import useExpandAccordion from "@/hooks/expandAccordion";
import ComponentCard from "@components/common/ComponentCard";

import aboutConfig from "@utils/aboutConfig";

export default function About() {
  const [aboutInfo] = useState(aboutConfig);

  const { expand, setExpandedValue } = useExpandAccordion(aboutInfo);

  return (
    <>
      <div className="flex h-full md:ml-[10%] md:mr-[10%]">
        <ComponentCard
          title="General Information"
          className="w-full overflow-y-auto max-h-[95%]"
        >
          {expand.map((prev) => (
            <div key={prev.id} className="mb-10">
              <Accordion
                id={prev.id}
                setExpanded={setExpandedValue}
                expand={prev.value}
                title={prev.title}
                description={prev.description}
              ></Accordion>
            </div>
          ))}
        </ComponentCard>
      </div>
    </>
  );
}
