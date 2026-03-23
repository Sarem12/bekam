"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authUtils } from "@/lib/localdata";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ Step 1: wait for client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Step 2: check auth AFTER hydration
  useEffect(() => {
    if (!hydrated) return;

    const savedId = authUtils.getId();
    console.log("AuthGuard sees:", savedId);

    if (!savedId) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    } else {
      setUserId(savedId);
    }
  }, [hydrated, pathname, router]);

  // ⏳ Wait until hydration finishes
  if (!hydrated) {
    return (
      <div>
      </div>
    );
  }

  // ✅ Allow login page
  if (!userId && pathname === "/login") {
    return <>{children}</>;
  }

  // 🚫 Block until redirect happens
  if (!userId) return null;

  // ✅ Authorized
  return <>{children}</>;
}