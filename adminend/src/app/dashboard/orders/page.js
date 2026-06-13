import OrderHistoryDashboard from "@/components/OrderHistoryDashboard";

export default function OrdersPage() {
  return (
    <OrderHistoryDashboard
      activeItem="Orders"
      heading="Orders"
      rowFilter="active"
      editableStatus
      viewBasePath="/dashboard/orders"
    />
  );
}
