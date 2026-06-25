import { EditorialActivityPanel } from "./EditorialActivityPanel";
import { EditorialMainContent } from "./EditorialMainContent";
import { EditorialSidebar } from "./EditorialSidebar";
import { EditorialTopHeader } from "./EditorialTopHeader";
import type {
  AdminDashboardData,
  EditorialUser,
  StoryAction,
  StoryListItem,
} from "@/lib/editorialTypes";

type EditorialOSShellProps = {
  user: EditorialUser;
  stories: StoryListItem[];
  dashboard: AdminDashboardData;
  createStoryAction: StoryAction;
  updateStoryAction: StoryAction;
  publishStoryAction: StoryAction;
  deleteStoryAction: StoryAction;
};

export function EditorialOSShell({
  user,
  stories,
  dashboard,
  createStoryAction,
  updateStoryAction,
  publishStoryAction,
  deleteStoryAction,
}: EditorialOSShellProps) {
  return (
    <div className="admin-surface min-h-screen text-[color:var(--admin-text)]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col lg:flex-row">
        <EditorialSidebar user={user} />
        <div className="min-w-0 flex-1">
          <div className="px-4 pt-5 lg:px-5">
            <EditorialTopHeader user={user} createStoryAction={createStoryAction} />
          </div>
          <div className="flex min-w-0 flex-col xl:flex-row">
            <EditorialMainContent
              stories={stories}
              dashboard={dashboard}
              updateStoryAction={updateStoryAction}
              publishStoryAction={publishStoryAction}
              deleteStoryAction={deleteStoryAction}
            />
            <EditorialActivityPanel dashboard={dashboard} stories={stories} />
          </div>
        </div>
      </div>
    </div>
  );
}
