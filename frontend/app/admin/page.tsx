"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the PIN authentication page
    router.push("/admin/pin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting to admin authentication...</p>
    </div>
  );
}
