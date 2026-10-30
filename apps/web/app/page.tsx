export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
      <div className="text-center">
        <div className="mb-4 text-5xl font-bold tracking-tight">
          FlowArm<span className="text-blue-500">.</span>
        </div>

        <p className="text-zinc-400">
          Visual Workflow Automation & Debugging Platform
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Development Environment Ready
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          FlowArm v0.1.0
        </p>
      </div>
    </main>
  );
}