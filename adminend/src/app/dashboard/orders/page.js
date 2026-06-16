import OrderHistoryDashboard from "@/components/OrderHistoryDashboard";

export default function OrdersPage() {
  return (
    <OrderHistoryDashboard
      activeItem="Orders"
      heading="Orders"
      rowFilter="active"
      editableStatus
      editablePayment
      viewBasePath="/dashboard/orders"
      pageDescription="Manage active orders here. Update fulfillment and payment status as you process them, then delivered or cancelled orders move into Order History."
    />
  );
}
