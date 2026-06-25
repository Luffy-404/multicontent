import { EditorialActivityPanel } from "./EditorialActivityPanel";
import { EditorialMainContent } from "./EditorialMainContent";
import { EditorialSidebar } from "./EditorialSidebar";
import { EditorialTopHeader } from "./EditorialTopHeader";

export function EditorialOSShell() {
  return (
    <div className="admin-surface min-h-screen text-[color:var(--admin-text)]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col lg:flex-row">
        <EditorialSidebar />
        <div className="min-w-0 flex-1">
          <div className="px-4 pt-5 lg:px-5">
            <EditorialTopHeader />
          </div>
          <div className="flex min-w-0 flex-col xl:flex-row">
            <EditorialMainContent />
            <EditorialActivityPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
