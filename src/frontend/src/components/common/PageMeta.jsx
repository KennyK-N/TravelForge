import { Helmet } from "react-helmet-async";

export default function PageMeta({
  title = "Travel Planner",
  description = "AI travel planner app",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
