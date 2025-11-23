import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./dashboard-layout-client";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server Side Auth Check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Render Client Wrapper
  return (
    <DashboardLayoutClient user={user}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </DashboardLayoutClient>
  );
}
