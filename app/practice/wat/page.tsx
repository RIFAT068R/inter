import { Suspense } from "react";
import { WatSetupClient } from "@/components/wat-setup-client";

export default async function WatSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const isDemo = params.demo === "1";

  return (
    <Suspense>
      <WatSetupClient isDemo={isDemo} />
    </Suspense>
  );
}
