import { redirect } from "next/navigation";
import { EditorialOSShell } from "@/components/admin/editorial-os/EditorialOSShell";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getEditorialDashboardData } from "@/services/editorial/dashboard";
import {
  createStoryAction,
  deleteStoryAction,
  getStories,
  publishStoryAction,
  updateStoryAction,
} from "@/services/editorial/stories";

export const dynamic = "force-dynamic";

export default async function DashboardAdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stories = await getStories();
  const dashboard = await getEditorialDashboardData(stories);

  return (
    <EditorialOSShell
      user={user}
      stories={stories}
      dashboard={dashboard}
      createStoryAction={createStoryAction}
      updateStoryAction={updateStoryAction}
      publishStoryAction={publishStoryAction}
      deleteStoryAction={deleteStoryAction}
    />
  );
}
