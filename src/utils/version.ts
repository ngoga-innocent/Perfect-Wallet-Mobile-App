// utils/version.ts

export function compareVersions(current: string, required: string): number {
  const currentParts = current
    .split(".")
    .map((part) => parseInt(part, 10) || 0);

  const requiredParts = required
    .split(".")
    .map((part) => parseInt(part, 10) || 0);

  const length = Math.max(currentParts.length, requiredParts.length);

  for (let i = 0; i < length; i++) {
    const currentPart = currentParts[i] || 0;
    const requiredPart = requiredParts[i] || 0;

    if (currentPart > requiredPart) return 1;
    if (currentPart < requiredPart) return -1;
  }

  return 0;
}

export function isVersionBelow(current: string, minimum: string): boolean {
  return compareVersions(current, minimum) < 0;
}

export function isUpdateAvailable(current: string, latest: string): boolean {
  return compareVersions(current, latest) < 0;
}
