import { MainLayout } from "@/components/layout/main-layout";

/**
 * Main route group — wraps public-facing pages (home, about, services, contact).
 * Uses MainLayout which provides the site-wide navbar + footer.
 */
export default function MainGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
