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
      pageDescription="Manage unpaid orders here. Update fulfillment status as you process them, then mark payment as paid to move the order into Order History."
    />
  );
}
