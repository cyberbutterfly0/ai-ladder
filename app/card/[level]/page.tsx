import CardClient from "./CardClient";
import { LEVELS } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: String(l.id) }));
}

export default function Page() {
  return <CardClient />;
}
