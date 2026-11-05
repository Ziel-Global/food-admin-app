import { Suspense } from "react";
import CustomerDetailClient from "./CustomerDetailClient";

export default function CustomerDetailPage({ params }: PageProps<"/customers/[id]">) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading customer…</div>}>
      <CustomerDetail params={params} />
    </Suspense>
  );
}

async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerDetailClient id={id} />;
}
