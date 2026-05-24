import { Container } from "@/components/Container";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";

export const dynamic = "force-dynamic";

export default async function DashboardAdminPage() {
  const settings = await getDashboardSettings();

  return (
    <Container className="py-8 sm:py-10">
      <div className="mb-8">
        <p className="font-tight text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
          Hidden Admin
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-none text-white">
          Dashboard controls
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          Prepared control surface for market, crypto, weather, quick stats, ordering,
          refresh intervals, and maintenance mode.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="font-tight text-xs font-bold uppercase text-cyan-300">Visibility</p>
          <div className="mt-4 grid gap-3">
            {settings.widgets.map((widget) => (
              <div key={widget.key} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0">
                <div>
                  <p className="font-semibold text-white">{widget.title}</p>
                  <p className="text-xs text-slate-400">{widget.type}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  widget.enabled ? "border-cyan-300/40 text-cyan-200" : "border-white/10 text-slate-500"
                }`}>
                  {widget.enabled ? "Enabled" : "Hidden"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="font-tight text-xs font-bold uppercase text-cyan-300">Ordering & Refresh</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <div className="grid grid-cols-[1fr_5rem_7rem] bg-slate-950/60 px-4 py-3 text-xs font-bold uppercase text-slate-400">
              <span>Widget</span>
              <span>Order</span>
              <span>Refresh</span>
            </div>
            {settings.widgets.map((widget) => (
              <div key={widget.key} className="grid grid-cols-[1fr_5rem_7rem] border-t border-white/10 px-4 py-3 text-sm text-slate-300">
                <span className="truncate text-white">{widget.title}</span>
                <span>{widget.position}</span>
                <span>{widget.refreshMinutes}m</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
          <p className="font-tight text-xs font-bold uppercase text-cyan-300">Settings</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase text-slate-400">Maintenance</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {settings.maintenanceMode ? "On" : "Off"}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase text-slate-400">Global Refresh</p>
              <p className="mt-2 text-lg font-semibold text-white">{settings.refreshMinutes}m</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs uppercase text-slate-400">Widgets</p>
              <p className="mt-2 text-lg font-semibold text-white">{settings.widgets.length}</p>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
