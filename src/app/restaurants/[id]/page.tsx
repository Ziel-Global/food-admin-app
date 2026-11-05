import { Suspense } from "react";
import RestaurantDetailClient from "./RestaurantDetailClient";

export default function RestaurantDetailPage({ params }: PageProps<"/restaurants/[id]">) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading partner…</div>}>
      <RestaurantDetail params={params} />
    </Suspense>
  );
}

async function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RestaurantDetailClient id={id} />;
}
