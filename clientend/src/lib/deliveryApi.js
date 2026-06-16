import { getApiBaseUrl } from "@/lib/apiBaseUrl";

let cachedDeliveryZones = null;

export async function fetchDeliveryZones({ force = false } = {}) {
  if (cachedDeliveryZones && !force) {
    return cachedDeliveryZones;
  }

  const response = await fetch(`${getApiBaseUrl()}/delivery/get-zones`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Could not load delivery zones");
  }

  cachedDeliveryZones = data.zones;
  return cachedDeliveryZones;
}

export function clearDeliveryZonesCache() {
  cachedDeliveryZones = null;
}
