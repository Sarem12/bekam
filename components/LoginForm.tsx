"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/service/admin/auth";
import { authUtils } from "@/lib/localdata";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return setError("Missing credentials.");
    }

    setError("");
    setIsPending(true);

    try {
      const result = await loginAction(username, password);
      console.log("Login result:", result);
      if (result?.error) {
        setError(result.error);
      } else if (result?.userId) {
        // ✅ SAVE
        authUtils.saveId(result.userId);

        // ✅ DEBUG (DON'T REMOVE YET)
        console.log("Saved ID:", result.userId);
        console.log("Read after save:", authUtils.getId());

        // ✅ NAVIGATE (NO reload)
        router.replace("/");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      setError("Database connection failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        {error && <div className="text-red-400">{error}</div>}

        <input
          placeholder="User_ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-slate-800"
        />

        <input
          type="password"
          placeholder="Access_Key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-800"
        />

        <button disabled={isPending} className="w-full p-3 bg-slate-700 hover:bg-slate-600">
          {isPending ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}