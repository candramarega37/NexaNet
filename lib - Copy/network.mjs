/** @param {string} address */
export function parseIPv4(address) {
  const parts = address.split(".");
  if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part))) return null;
  const octets = parts.map(Number);
  if (octets.some(octet => octet < 0 || octet > 255)) return null;
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}

/** @param {string} address */
export function isValidIPv4(address) { return parseIPv4(address) !== null; }

/** @param {string} address @param {number} prefix */
export function subnetInfo(address, prefix) {
  const ip = parseIPv4(address);
  if (ip === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const format = value => [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join(".");
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : 2 ** (32 - prefix) - 2;
  return { address, prefix, network: format(network), broadcast: format(broadcast), subnetMask: format(mask), usableHosts };
}

/** @param {string} left @param {string} right @param {number} prefix */
export function isSameSubnet(left, right, prefix) {
  const leftInfo = subnetInfo(left, prefix);
  const rightInfo = subnetInfo(right, prefix);
  return Boolean(leftInfo && rightInfo && leftInfo.network === rightInfo.network);
}
