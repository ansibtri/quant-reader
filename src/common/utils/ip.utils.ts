type Octet = number;
export type IPv4 = `${Octet}.${Octet}.${Octet}.${Octet}`;

export function isValidIPv4(ip: string): ip is IPv4 {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = Number(part);
    return Number.isInteger(num) && num >= 0 && num <= 255;
  });
}

export function parseIPv4(ip: string): IPv4 {
  if (isValidIPv4(ip)) return ip;
  return '0.0.0.0' as IPv4; // fallback
}
