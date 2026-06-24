import { adminApi } from "@/lib/adminApi";

export async function getDeliveryZonesFromApi() {
  const data = await adminApi("/delivery/get-zones");
  return data.zones;
}

export async function updateDeliveryZonesOnApi(zones) {
  const data = await adminApi("/delivery/update-zones", {
    method: "PATCH",
    body: JSON.stringify(zones),
  });
  return data.zones;
}
