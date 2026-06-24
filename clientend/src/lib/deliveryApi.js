import { apiRequest } from "@/lib/api";

let cachedDeliveryZones = null;

export async function fetchDeliveryZones({ force = false } = {}) {
  if (cachedDeliveryZones && !force) {
    return cachedDeliveryZones;
  }

  const data = await apiRequest("/delivery/get-zones");

  cachedDeliveryZones = data.zones;
  return cachedDeliveryZones;
}

export function clearDeliveryZonesCache() {
  cachedDeliveryZones = null;
}
