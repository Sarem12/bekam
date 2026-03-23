"use client";

import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authUtils } from "@/lib/localdata";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Look for the ID
    const id = authUtils.getId();

    if (id) {
      // 2. If found, redirect safely AFTER the component renders
      router.push("/");
    } else {
      // 3. If no ID, stop the loading state so the form shows up
      setChecking(false);
    }
  }, [router]);

  // 4. While checking, show a clean background so the form doesn't "flicker"
  if (checking) {
    return <div>
      
    </div>;
  }

  return <LoginForm />;
}