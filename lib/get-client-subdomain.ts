export default function getClientSubdomain() {
  const host = window.location.hostname;
  const subdomain = host.split(".")[0];

  return subdomain;
}
