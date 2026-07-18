import { AdminLoginContainer } from "@/features/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Accent rose radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/8 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="w-full flex justify-center relative z-10">
        <AdminLoginContainer />
      </div>
    </div>
  )
}
