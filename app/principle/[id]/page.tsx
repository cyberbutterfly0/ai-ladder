import PrincipleClient from "./PrincipleClient";
import { PRINCIPLES } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRINCIPLES.map((p) => ({ id: String(p.id) }));
}

export default function Page() {
  return <PrincipleClient />;
}
