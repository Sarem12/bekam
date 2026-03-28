"use client";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  // We keep this simple. 
  // If the user shouldn't be here (because they are already logged in),
  // the Middleware will redirect them before this even renders.
  
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-100 tracking-tighter">BEKAM AI</h1>
          <p className="text-slate-400 mt-2">Log in to access your curriculum</p>
        </header>
        
        <LoginForm />
      </div>
    </div>
  );
}