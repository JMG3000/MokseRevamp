import { getAdminUser, type AdminUser } from "@/lib/admin-session";
import { redirect } from "next/navigation";

export type AdminDashboardData = {
  user: AdminUser;
  checks: string[];
};

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin?auth=required");
  }

  return user;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const user = await requireAdminUser();

  return {
    user,
    checks: [
      "Server-side admin session active",
      "Prototype plaintext credentials removed",
      "Notion resource endpoint guarded by cache and rate limits",
    ],
  };
}
