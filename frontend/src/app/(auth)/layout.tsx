import { AuthLayout } from "@/components/layout/auth-layout";

/**
 * Auth route group — wraps login/register/forgot-password pages.
 * Uses AuthLayout which provides a clean centered card layout
 * without any navbar or footer.
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
