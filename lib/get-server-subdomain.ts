import { headers } from "next/headers";

export default function getServerSubdomain() {
  const headersList = headers();
  const host = headersList.get("host");
  const subdomain = host?.split(".")[0];

  return subdomain;
}
