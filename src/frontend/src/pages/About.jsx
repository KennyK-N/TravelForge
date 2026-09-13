import { useState } from "react";

import Accordion from "@components/ui/Accordion";
import useExpandAccordion from "@/hooks/expandAccordion";
import ComponentCard from "@components/common/ComponentCard";

const accordionItems = [
  {
    id: 0,
    title: "test",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam provident numquam laboriosam mollitia cumque iure nesciunt velit, natus, totam exercitationem enim saepe neque quae, repellendus quod perferendis libero illo odio?",
  },
  {
    id: 1,
    title: "test",
    description: "test",
  },
  {
    id: 2,
    title: "test",
    description: "test",
  },
  { id: 3, title: "test", description: "test", value: false },
  { id: 4, title: "test", description: "test", value: false },
];

export default function About() {
  const [items] = useState(accordionItems);
  const { expand, setExpandedValue } = useExpandAccordion(items);

  return (
    <>
      <div className="flex h-full md:ml-[10%] md:mr-[10%]">
        <ComponentCard
          title="About"
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
