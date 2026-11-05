import { Suspense } from "react";
import { PayoutsClient } from "./PayoutsClient";

export default function PayoutsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading payouts…</div>}>
      <PayoutsClient />
    </Suspense>
  );
}
