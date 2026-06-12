import OrderHistoryDashboard, {
  activeOrderRows,
  orderDashboardSummaryCards,
} from "@/components/OrderHistoryDashboard";

export default function OrdersPage() {
  return (
    <OrderHistoryDashboard
      activeItem="Orders"
      heading="Orders"
      cards={orderDashboardSummaryCards}
      rows={activeOrderRows}
      editableStatus
      viewBasePath="/dashboard/orders"
    />
  );
}
