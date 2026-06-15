import AccountDetailsDashboard from "@/components/AccountDetailsDashboard";

export default async function CustomerAccountDetailsPage({ params }) {
  const { accountId } = await params;

  return <AccountDetailsDashboard accountId={accountId} />;
}
